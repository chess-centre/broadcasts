import Chessground from "@react-chess/chessground";
import "chessground/assets/chessground.base.css";
import "chessground/assets/chessground.brown.css";
import "chessground/assets/chessground.cburnett.css";
import "../../assets/board.css";
import EvalBar from "./EvalBar";

function PlayerRow({ name, rating, clock, isBlack }) {
  return (
    <div className="flex items-center justify-between px-3 py-1.5">
      <div className="flex items-center gap-2 min-w-0">
        <div
          className={`w-2.5 h-2.5 rounded-sm flex-shrink-0 ${
            isBlack ? "bg-slate-500" : "bg-white"
          }`}
        />
        <span className="text-sm text-slate-200 truncate">{name || "---"}</span>
        {rating && (
          <span className="text-xs text-slate-500 flex-shrink-0">{rating}</span>
        )}
      </div>
      <span className="text-xs font-mono text-slate-400 tabular-nums flex-shrink-0">
        {clock}
      </span>
    </div>
  );
}

export default function BoardWrapper({ name, fen, result, blackClock, whiteClock, lastMove, lastMoveSan, info, evaluation }) {
  const isFinished = result && !result.includes("*");

  return (
    <div className="board-with-eval">
      <EvalBar evaluation={evaluation} fen={fen} />

      <div className="bg-gh-surface rounded-r-lg overflow-hidden border border-gh-border border-l-0 flex-1 shadow-lg shadow-black/20">
        <PlayerRow
          name={info?.blackInfo?.name}
          rating={info?.blackInfo?.rating}
          clock={blackClock}
          isBlack
        />

        <div className="board-container">
          <Chessground
            contained={true}
            config={{
              fen: fen === "start" ? undefined : fen,
              viewOnly: true,
              highlight: { lastMove: true },
              lastMove: lastMove || undefined,
              animation: { enabled: true, duration: 300 },
            }}
          />
        </div>

        <PlayerRow
          name={info?.whiteInfo?.name}
          rating={info?.whiteInfo?.rating}
          clock={whiteClock}
        />

        <div className="flex items-center justify-between px-3 py-1 border-t border-gh-border/40">
          <span className="text-xs text-slate-500">Board {name}</span>
          <div className="flex items-center gap-2">
            {evaluation && !isFinished && (
              <span className="text-xs font-mono text-slate-500">d{evaluation.depth}</span>
            )}
            {isFinished && (
              <span className="text-xs font-mono text-emerald-500/70">Final</span>
            )}
            <span className={`text-xs font-medium ${isFinished ? "text-amber-400" : "text-slate-400"}`}>
              {isFinished ? result : lastMoveSan || "..."}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
