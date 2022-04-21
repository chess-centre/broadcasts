import { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { usePGN } from "../../hooks/usePgn";
import BoardWrapper from "../Board/Board";

export default function ChessGame({ round, board }) {
  const { active, gameState } = usePGN();
  const [fen, setFen] = useState("start");
  const [result, setResult] = useState(null);
  const [lastMove, setLastMove] = useState("");
  const [whiteClock, setWhiteClock] = useState("00:00:00");
  const [blackClock, setBlackClock] = useState("00:00:00");
  const [info, setInfo] = useState({
    whiteInfo: null,
    blackInfo: null,
  });

  
  useEffect(() => {

    const chess = new Chess();

    if(gameState && gameState.pgn) {
      chess.load_pgn(gameState.pgn);
      setFen(chess.fen());
      setWhiteClock(gameState.whiteClock);
      setBlackClock(gameState.blackClock);
      setInfo({
        whiteInfo: gameState.whiteInfo,
        blackInfo: gameState.blackClock
      });
      setResult(gameState.result);
      setLastMove(gameState.lastMove);
    }

  }, [active, gameState]);

  return (
    <div>
      <BoardWrapper
        name={`${board.toString()}`}
        lastMove={lastMove}
        whiteClock={whiteClock}
        blackClock={blackClock}
        info={info}
        fen={fen}
        clockChange={""}
        ready={active}
        result={result}
      />
    </div>
  );
}
