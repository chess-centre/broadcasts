import { useState } from "react";
import { useInterval } from "../hooks";
import BoardWrapper from "./Board";

export default function ChessGame({ round, board }) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [pgn, setPGN] = useState("start");

  useInterval(() => {
    const getPgnStr = async () => {
      let text = "";
      try {
        const response = await fetch(
          `http://localhost:8080/${round}/${board}`,
          {
            method: "get",
            url: `http://localhost:8080`,
          }
        );
        text = await response.text();
      } catch (error) {
        console.log("exception thrown", error);
      }

      if (text) {
        setPGN(text);
        setIsLoaded(true);
      }
    };
    getPgnStr();
  }, 3000);

  return (
    <BoardWrapper
      name={`Board ${board.toString()}`}
      pgn={pgn}
      ready={isLoaded}
    />
  );
}