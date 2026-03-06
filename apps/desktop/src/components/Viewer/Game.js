import { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { usePGN } from "../../hooks/usePgn";
import { useBroadcastSettings } from "../../context/BroadcastSettingsContext";
import { detectOpening } from "../../data/openings";
import useClockCountdown from "../../hooks/useClockCountdown";
import BoardWrapper from "../Board/Board";

/**
 * Extract move tokens from PGN string and apply them one by one.
 * Returns FEN, last move info, SAN move list.
 */
function parsePgn(pgnString) {
  const chess = new Chess();

  const moveSection = pgnString
    .replace(/\[.*?\]\s*/g, "")
    .replace(/\{[^}]*\}/g, "")
    .replace(/\d+\.+\s*/g, "")
    .replace(/\s*(1-0|0-1|1\/2-1\/2|\*)\s*$/, "")
    .trim();

  const tokens = moveSection.split(/\s+/).filter((t) => t.length > 0);

  let lastMove = null;
  const moves = [];
  for (const token of tokens) {
    const move = chess.move(token);
    if (!move) break;
    lastMove = move;
    moves.push(move.san);
  }

  return {
    fen: chess.fen(),
    lastMove: lastMove ? [lastMove.from, lastMove.to] : null,
    lastMoveSan: lastMove ? lastMove.san : "",
    moves,
  };
}

/**
 * Extract clock annotations from PGN comments and compute last move time.
 */
function extractLastMoveTime(pgnString) {
  const clockRegex = /\[%clk\s+(\d+:\d+:\d+)\]/g;
  const clocks = [];
  let match;
  while ((match = clockRegex.exec(pgnString)) !== null) {
    clocks.push(match[1]);
  }
  if (clocks.length < 2) return null;

  // Last two clocks of the same color (every other entry)
  // clocks alternate: white, black, white, black...
  const lastIdx = clocks.length - 1;
  const prevSameColorIdx = lastIdx - 2;
  if (prevSameColorIdx < 0) return null;

  const prev = parseClockString(clocks[prevSameColorIdx]);
  const curr = parseClockString(clocks[lastIdx]);
  const diff = prev - curr;
  return diff > 0 ? diff : null;
}

function parseClockString(clock) {
  const parts = clock.split(":").map(Number);
  return parts[0] * 3600 + parts[1] * 60 + parts[2];
}

/**
 * Full parse returning history at every position (for game viewer modal).
 */
export function parsePgnFull(pgnString) {
  const chess = new Chess();

  const moveSection = pgnString
    .replace(/\[.*?\]\s*/g, "")
    .replace(/\{[^}]*\}/g, "")
    .replace(/\d+\.+\s*/g, "")
    .replace(/\s*(1-0|0-1|1\/2-1\/2|\*)\s*$/, "")
    .trim();

  const tokens = moveSection.split(/\s+/).filter((t) => t.length > 0);

  const history = [{ fen: chess.fen(), san: null, from: null, to: null }];
  for (const token of tokens) {
    const move = chess.move(token);
    if (!move) break;
    history.push({ fen: chess.fen(), san: move.san, from: move.from, to: move.to });
  }

  return history;
}

export default function ChessGame({ round, board, onClick, isFeatured }) {
  const { active, gameState, evaluation } = usePGN(board);
  const { settings } = useBroadcastSettings();
  const [fen, setFen] = useState("start");
  const [result, setResult] = useState(null);
  const [lastMove, setLastMove] = useState(null);
  const [lastMoveSan, setLastMoveSan] = useState("");
  const [serverWhiteClock, setServerWhiteClock] = useState("00:00:00");
  const [serverBlackClock, setServerBlackClock] = useState("00:00:00");
  const [info, setInfo] = useState({ whiteInfo: null, blackInfo: null });
  const [opening, setOpening] = useState(null);
  const [flipped, setFlipped] = useState(false);
  const [lastMoveTime, setLastMoveTime] = useState(null);

  const isFinished = result && !result.includes("*");

  const {
    whiteClock: animatedWhiteClock,
    blackClock: animatedBlackClock,
    whiteActive,
    blackActive,
  } = useClockCountdown(serverWhiteClock, serverBlackClock, fen, isFinished, settings.animateClocks);

  useEffect(() => {
    if (!gameState || !gameState.pgn) return;

    setServerWhiteClock(gameState.whiteClock);
    setServerBlackClock(gameState.blackClock);
    setInfo({ whiteInfo: gameState.whiteInfo, blackInfo: gameState.blackInfo });
    setResult(gameState.gameResult);

    try {
      const parsed = parsePgn(gameState.pgn);
      setFen(parsed.fen);
      setLastMove(parsed.lastMove);
      setLastMoveSan(parsed.lastMoveSan);
      setOpening(detectOpening(parsed.moves));

      if (settings.showMoveTime) {
        setLastMoveTime(extractLastMoveTime(gameState.pgn));
      }
    } catch (e) {
      // keep last known position
    }
  }, [gameState, settings.showMoveTime]);

  return (
    <BoardWrapper
      name={board}
      lastMove={lastMove}
      lastMoveSan={lastMoveSan}
      whiteClock={settings.animateClocks ? animatedWhiteClock : serverWhiteClock}
      blackClock={settings.animateClocks ? animatedBlackClock : serverBlackClock}
      whiteActive={whiteActive}
      blackActive={blackActive}
      info={info}
      fen={fen}
      ready={active}
      result={result}
      evaluation={evaluation}
      opening={opening}
      flipped={flipped}
      onFlip={() => setFlipped((f) => !f)}
      onClick={onClick}
      isFeatured={isFeatured}
      lastMoveTime={lastMoveTime}
    />
  );
}
