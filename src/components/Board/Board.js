import { Chessboard } from "react-chessboard";

export default function BoardWrapper(props) {
  const { name, fen, result, blackClock, whiteClock, lastMove, info } = props;

  return (
    <div className="bg-slate-900 text-black m-auto py-2 shadow-lg">
      <div className="grid grid-cols-1 relative">
        <div className="mx-auto w-full">
          {/* BOARD NUMBER */}
          <div className="relative">
            <div className="mx-auto w-10 bg-orange-400 border-orange-600 border-2 text-md rounded-sm font-bold text-white">
              {name}
            </div>
          </div>

          {/* BLACK INFO */}
          <div className="grid grid-cols-6 px-2 text-sm bg-slate-800 py-3 rounded-t-md text-white font-medium border-t-2 border-l-2 border-r-2 border-orange-600 -mt-2">
            <div>{info?.blackInfo?.rating}</div>
            <div className="col-span-4">{info?.blackInfo?.name}</div>
            <div>{blackClock}</div>
          </div>

          {/* BOARD */}
          <div className="border-l border-r border-orange-600">
            <Chessboard
              on
              showBoardNotation={true}
              customDarkSquareStyle={{ backgroundColor: "#067a87" }}
              customLightSquareStyle={{ backgroundColor: "#5499ab" }}
              id={1}
              position={fen}
              boardWidth={330}
            />
          </div>
          {/* WHITE INFO */}
          <div className="grid grid-cols-5 px-2 text-sm bg-slate-800 py-3 rounded-b-md text-white font-medium border-b-2 border-l-2 border-r-2 border-orange-600">
            <div>{info?.whiteInfo?.rating}</div>
            <div className="col-span-3"><span>{info?.whiteInfo?.name}</span></div>
            <div>{whiteClock}</div>
          </div>

          {/* MOVE & RESULT DETAILS */}
          <div className="relative">
            <div className="mx-auto text-slate-100 text-sm w-28 bg-orange-500 border-2 border-orange-600 px-2 rounded-sm -mt-2">
              {lastMove}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
