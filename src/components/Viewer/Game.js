import { useEffect, useState } from "react";
import { Chess } from "chess.js";
import { usePGN } from "../../hooks/usePgn";
import BoardWrapper from "../Board/Board";

export default function ChessGame({ round, board }) {
  const { active, gameState } = usePGN();
  const [fen, setFen] = useState("start");
  const [result, setResult] = useState(null);
  const [lastMove, setLastMove] = useState("");
  const [lastMoveSan, setLastMoveSan] = useState("");
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

      const moves = chess.history({ verbose: true });

      const { from, to, san } = moves[moves.length - 1];

      const lastMove = [from, to];

      setFen(chess.fen());
      setWhiteClock(gameState.whiteClock);
      setBlackClock(gameState.blackClock);
      setInfo({
        whiteInfo: gameState.whiteInfo,
        blackInfo: gameState.blackInfo
      });
      setResult(gameState.gameResult);
      setLastMove(lastMove);
      setLastMoveSan(san);
    }

  }, [active, gameState]);

  return (
    <div>
      <BoardWrapper
        name={`${board.toString()}`}
        lastMove={lastMove}
        lastMoveSan={lastMoveSan}
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
