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
    <div className="bg-slate-800 text-white m-auto p-4 shadow-lg border-4 border-brand-orange rounded-lg">
      <div className="grid grid-cols-10">
        <div className="col-span-3">
          <div className="grid grid-cols-1">
            <p className="text-white font-medium pb-1 h-10">{name}</p>
            <p className="text-sm">{info.black}</p>
            <p className="text-white text-3xl font-bold my-36">{lastMove}</p>
            <p className="text-sm">{info.white}</p>
          </div>
        </div>
        <div className="col-span-7">
          <div className="mx-auto">
            <Chessboard
              showBoardNotation={true}
              customDarkSquareStyle={{ backgroundColor: "#067a87" }}
              customLightSquareStyle={{ backgroundColor: "#5499ab" }}
              id={1}
              position={fen}
              boardWidth={410}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
