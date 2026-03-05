import Chessground from "@react-chess/chessground";
import "chessground/assets/chessground.base.css";
import "chessground/assets/chessground.brown.css";
import "chessground/assets/chessground.cburnett.css";
import "../../assets/board.css";
import "../../assets/board-themes.css";
import EvalBar from "./EvalBar";
import { useBroadcastSettings } from "../../context/BroadcastSettingsContext";

/**
 * Estimate expected Elo change for a result.
 * Uses simplified formula: K * (score - expected)
 * where expected = 1 / (1 + 10^((opponentRating - playerRating) / 400))
 */
function estimateEloDiff(playerRating, opponentRating, score) {
  if (!playerRating || !opponentRating) return null;
  const pr = parseInt(playerRating);
  const or = parseInt(opponentRating);
  if (isNaN(pr) || isNaN(or)) return null;
  const expected = 1 / (1 + Math.pow(10, (or - pr) / 400));
  const K = 20;
  const diff = Math.round(K * (score - expected));
  return diff;
}

function PlayerRow({ name, rating, clock, isBlack, showRatings, showClocks, eloDiff }) {
  return (
    <div className="flex items-center justify-between px-3 py-1.5">
      <div className="flex items-center gap-2 min-w-0">
        <div
          className={`w-2.5 h-2.5 rounded-sm flex-shrink-0 ${
            isBlack ? "bg-slate-500" : "bg-white"
          }`}
        />
        <span className="text-sm text-slate-200 truncate">{name || "---"}</span>
        {showRatings && rating && (
          <span className="text-xs text-slate-500 flex-shrink-0">{rating}</span>
        )}
        {eloDiff !== null && eloDiff !== undefined && (
          <span
            className={`text-[10px] font-mono flex-shrink-0 ${
              eloDiff > 0 ? "text-green-400" : eloDiff < 0 ? "text-red-400" : "text-slate-500"
            }`}
          >
            {eloDiff > 0 ? `+${eloDiff}` : eloDiff}
          </span>
        )}
      </div>
      {showClocks && (
        <span className="text-xs font-mono text-slate-400 tabular-nums flex-shrink-0">
          {clock}
        </span>
      )}
    </div>
  );
}

export default function BoardWrapper({ name, fen, result, blackClock, whiteClock, lastMove, lastMoveSan, info, evaluation }) {
  const { settings } = useBroadcastSettings();
  const isFinished = result && !result.includes("*");

  // Calculate Elo diffs when game is finished and setting is enabled
  let whiteEloDiff = null;
  let blackEloDiff = null;
  if (settings.showRatingDiff && isFinished && info?.whiteInfo?.rating && info?.blackInfo?.rating) {
    const whiteScore = result === "1-0" ? 1 : result === "0-1" ? 0 : 0.5;
    whiteEloDiff = estimateEloDiff(info.whiteInfo.rating, info.blackInfo.rating, whiteScore);
    blackEloDiff = estimateEloDiff(info.blackInfo.rating, info.whiteInfo.rating, 1 - whiteScore);
  }

  return (
    <div className={`board-with-eval board-theme-${settings.boardTheme}`}>
      {settings.showEvalBar && <EvalBar evaluation={evaluation} fen={fen} />}

      <div className={`bg-gh-surface overflow-hidden border border-gh-border flex-1 shadow-lg shadow-black/20 ${
        settings.showEvalBar ? "rounded-r-lg border-l-0" : "rounded-lg"
      }`}>
        <PlayerRow
          name={info?.blackInfo?.name}
          rating={info?.blackInfo?.rating}
          clock={blackClock}
          isBlack
          showRatings={settings.showRatings}
          showClocks={settings.showClocks}
          eloDiff={blackEloDiff}
        />

        <div className="board-container">
          <Chessground
            contained={true}
            config={{
              fen: fen === "start" ? undefined : fen,
              viewOnly: true,
              highlight: { lastMove: settings.showLastMove },
              lastMove: settings.showLastMove ? lastMove || undefined : undefined,
              animation: { enabled: settings.animationSpeed > 0, duration: settings.animationSpeed },
            }}
          />
        </div>

        <PlayerRow
          name={info?.whiteInfo?.name}
          rating={info?.whiteInfo?.rating}
          clock={whiteClock}
          showRatings={settings.showRatings}
          showClocks={settings.showClocks}
          eloDiff={whiteEloDiff}
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
