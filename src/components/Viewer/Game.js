import { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { usePGN } from "../../hooks/usePgn";
import BoardWrapper from "../Board/Board";

/**
 * Extract move tokens from PGN string and apply them one by one.
 * Stops at the first illegal move so we always show a valid position.
 */
function parsePgn(pgnString) {
  const chess = new Chess();

  // Strip headers and extract move section
  const moveSection = pgnString
    .replace(/\[.*?\]\s*/g, "")
    .replace(/\{[^}]*\}/g, "")
    .replace(/\d+\.+\s*/g, "")
    .replace(/\s*(1-0|0-1|1\/2-1\/2|\*)\s*$/, "")
    .trim();

  const tokens = moveSection.split(/\s+/).filter((t) => t.length > 0);

  let lastMove = null;
  for (const token of tokens) {
    const move = chess.move(token);
    if (!move) break;
    lastMove = move;
  }

  return {
    fen: chess.fen(),
    lastMove: lastMove ? [lastMove.from, lastMove.to] : null,
    lastMoveSan: lastMove ? lastMove.san : "",
  };
}

export default function ChessGame({ round, board }) {
  const { active, gameState, evaluation } = usePGN(board);
  const [fen, setFen] = useState("start");
  const [result, setResult] = useState(null);
  const [lastMove, setLastMove] = useState(null);
  const [lastMoveSan, setLastMoveSan] = useState("");
  const [whiteClock, setWhiteClock] = useState("00:00:00");
  const [blackClock, setBlackClock] = useState("00:00:00");
  const [info, setInfo] = useState({ whiteInfo: null, blackInfo: null });

  useEffect(() => {
    if (!gameState || !gameState.pgn) return;

    setWhiteClock(gameState.whiteClock);
    setBlackClock(gameState.blackClock);
    setInfo({ whiteInfo: gameState.whiteInfo, blackInfo: gameState.blackInfo });
    setResult(gameState.gameResult);

    try {
      const parsed = parsePgn(gameState.pgn);
      setFen(parsed.fen);
      setLastMove(parsed.lastMove);
      setLastMoveSan(parsed.lastMoveSan);
    } catch (e) {
      // keep last known position
    }
  }, [gameState]);

  return (
    <BoardWrapper
      name={board}
      lastMove={lastMove}
      lastMoveSan={lastMoveSan}
      whiteClock={whiteClock}
      blackClock={blackClock}
      info={info}
      fen={fen}
      ready={active}
      result={result}
      evaluation={evaluation}
    />
  );
}
