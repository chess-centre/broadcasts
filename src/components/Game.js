import { useState } from "react";
import { useInterval } from "../hooks";
import BoardWrapper from "./Board";

const BASE_PATH = "http://localhost:8080";

export default function ChessGame({ round, board, interval = 1000 }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [pgn, setPGN] = useState("start");

  useInterval(() => {
    const getPgnStr = async () => {
      let text = "";
      try {
        const response = await fetch(`${BASE_PATH}/${round}/${board}`);
        text = await response.text();
      } catch (error) {
        console.log(error);
      }

      if (text) {
        setPGN(text);
        setIsLoaded(true);
      }
    };
    getPgnStr();
  }, interval);

  return (
    <BoardWrapper
      name={`Board ${board.toString()}`}
      pgn={pgn}
      ready={isLoaded}
    />
  );
}
