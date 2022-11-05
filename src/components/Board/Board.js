import Chessground from "@react-chess/chessground";
// these styles must be imported somewhere
import "chessground/assets/chessground.base.css";
import "chessground/assets/chessground.brown.css";
import "chessground/assets/chessground.cburnett.css";
import "../../assets/board.css";

export default function BoardWrapper(props) {
  const {
    name,
    fen,
    result,
    blackClock,
    whiteClock,
    lastMove,
    lastMoveSan,
    info,
  } = props;

  return (
    <div className="bg-slate-900 m-auto">
      <div className="relative">
        <div className="mx-auto">
          {/* BOARD NUMBER */}
          <div className="relative">
            <div className="mx-auto w-10 shadow-inner bg-orange-500  text-md font-bold text-white">
              {name}
            </div>
          </div>

          {/* BLACK INFO */}
          <div className="grid grid-cols-6 px-2 text-sm bg-slate-800 py-3 text-white font-medium border-t-2 border-l-2 border-r-2 border-orange-500 -mt-2">
            <div>{info?.blackInfo?.rating}</div>
            <div className="col-span-4">{info?.blackInfo?.name}</div>
            <div>{blackClock}</div>
          </div>

          {/* BOARD */}
          <div className="border-orange-600 border-r-2 border-l-2 bg-slate-800">
            <div className="h-64 w-64 text-center items-center m-auto">
              <Chessground
                contained={true}
                config={{
                  fen: fen.replace(/["']/g, '"'),
                  viewOnly: true,
                  highlight: { lastMove: true },
                  lastMove,
                }}
              />
            </div>
          </div>
          {/* WHITE INFO */}
          <div className="grid grid-cols-5 px-2 text-sm bg-slate-800 py-3 rounded-b-md text-white font-medium border-b-2 border-l-2 border-r-2 border-orange-500">
            <div>{info?.whiteInfo?.rating}</div>
            <div className="col-span-3">
              <span>{info?.whiteInfo?.name}</span>
            </div>
            <div>{whiteClock}</div>
          </div>

          {/* MOVE & RESULT DETAILS */}
          <div className="relative">
            <div className="mx-auto text-slate-100 text-sm w-28 bg-orange-500 px-2 rounded-sm -mt-2">
              {result && !result.includes("*") ? result : lastMoveSan ? lastMoveSan : "Loading..."}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
