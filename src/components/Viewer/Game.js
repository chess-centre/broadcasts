import { useState } from "react";
import { Chess } from "chess.js";
import { useInterval } from "../../hooks";
import BoardWrapper from "../Board/Board";

const BASE_PATH = "http://localhost:8080";

export default function ChessGame({ round, board, interval = 1000 }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [delay, setDelay] = useState(interval);
  const [fen, setFen] = useState("start");
  const [result, setResult] = useState(null);
  const [lastMove, setLastMove] = useState("");
  const [whiteClock, setWhiteClock] = useState("00:00:00");
  const [blackClock, setBlackClock] = useState("00:00:00");
  const [info, setInfo] = useState({
    whiteInfo: null,
    blackInfo: null
  })

  let counter = 0;

  const chess = new Chess();

  useInterval(() => {
    const getPgnStr = async () => {
      let data = "";
      try {
        const response = await fetch(`${BASE_PATH}/${round}/${board}`);
        data = await response.json();
        console.log("R:", data);
      } catch (error) {
        console.log(`Error: Terminating fetch for round: ${round} board: ${board}`);
        setDelay(null);
      }

      if (data) {
        console.log("Response", counter++);
        chess.load_pgn(data.pgn);
        const fenStr = chess.fen();

        setFen(fenStr);
        setLastMove(data.lastMove);
        setResult(data.gameResult);
        setWhiteClock(data.whiteClock);
        setBlackClock(data.blackClock);
        setInfo({ 
          whiteInfo: data.whiteInfo, 
          blackInfo: data.blackInfo 
        });
        setIsLoaded(true);
      }

      if(result !== "*" && result) {
        console.log("Game complete:", result);
        setDelay(null);
      }

    };
    getPgnStr();
  }, delay);

  return (
    <BoardWrapper
      name={`${board.toString()}`}
      lastMove={lastMove}
      whiteClock={whiteClock}
      blackClock={blackClock}
      info={info}
      fen={fen}
      clockChange={""}
      ready={isLoaded}
      result={result}
    />
  );
}
