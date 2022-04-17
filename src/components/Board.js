import { useState, useEffect } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import pgnParser from "pgn-parser";

export default function BoardWrapper(props) {
  const { name, pgn } = props;
  const [fen, setFen] = useState();
  const [info, setInfo] = useState({
    white: "",
    black: "",
  });

  const [lastMove, setLastMove] = useState("");

  useEffect(() => {
    const chess = new Chess();
    chess.load_pgn(pgn);
    setFen(chess.fen());

    try {
      const [parsed] = pgnParser.parse(pgn);
      const moves = parsed.moves;
      const whiteName = parsed?.headers?.find(
        ({ name }) => name === "White"
      )?.value;
      const blackName = parsed?.headers?.find(
        ({ name }) => name === "Black"
      )?.value;

      if (whiteName) {
        setInfo((i) => ({ ...i, white: whiteName }));
      }
      if (blackName) {
        setInfo((i) => ({ ...i, black: blackName }));
      }

      if (moves) {
        if (moves[moves.length - 1].move_number) {
          setLastMove(
            `${moves[moves.length - 1].move_number}. ${
              moves[moves.length - 1].move
            }`
          );
        } else {
          setLastMove(
            `${moves[moves.length - 2].move_number}. ... ${
              moves[moves.length - 1].move
            }`
          );
        }
      }
    } catch (error) {
      console.log("unable to set last move");
    }
  }, [pgn]);

  return (
    <div className="bg-slate-900 text-black m-auto px-4 py-2 shadow-lg">
      <div className="grid grid-cols-1">
        <div className="mx-auto w-full">
          <p className="font-bold text-white">
            <span className="w-10 bg-orange-500 text-lg px-2 rounded-sm">
              {name}
            </span>
          </p>
          <p className="text-sm bg-slate-800 pb-1 pt-2 rounded-t-md text-white font-medium border-t-2 border-l-2 border-r-2 border-orange-400 -mt-2">
            {info.black}
          </p>
          <div className="border-l border-r border-orange-400">
            <Chessboard
              showBoardNotation={true}
              customDarkSquareStyle={{ backgroundColor: "#067a87" }}
              customLightSquareStyle={{ backgroundColor: "#5499ab" }}
              id={1}
              position={fen}
              boardWidth={300}
            />
          </div>
          <p className="text-sm bg-slate-800 pt-1 pb-2 rounded-b-md text-white font-medium border-b-2 border-l-2 border-r-2 border-orange-400">
            {info.white}
          </p>
          <p className="text-white text-mg font-bold">{lastMove}</p>
        </div>
      </div>
    </div>
  );
}
