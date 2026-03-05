import { useRef, useEffect } from "react";
import { usePGN } from "../../hooks/usePgn";
import { useBroadcastSettings } from "../../context/BroadcastSettingsContext";

export default function SoundManager() {
  const { games } = usePGN();
  const { settings } = useBroadcastSettings();
  const moveAudioRef = useRef(null);
  const endAudioRef = useRef(null);
  const prevGamesRef = useRef(new Map());

  useEffect(() => {
    if (!settings.soundEnabled) return;

    games.forEach((game, board) => {
      const prev = prevGamesRef.current.get(board);
      if (!prev) return;

      // New move detected
      if (game.moveCount !== prev.moveCount && game.status === "ongoing") {
        try { moveAudioRef.current?.play(); } catch {}
      }

      // Game just finished
      if (prev.status === "ongoing" && game.status === "finished") {
        try { endAudioRef.current?.play(); } catch {}
      }
    });

    prevGamesRef.current = new Map(games);
  }, [games, settings.soundEnabled]);

  if (!settings.soundEnabled) return null;

  return (
    <>
      <audio ref={moveAudioRef} src="/beep.wav" preload="auto" />
      <audio ref={endAudioRef} src="/starting.wav" preload="auto" />
    </>
  );
}
