import { useState, useEffect, useMemo } from "react";
import Chessground from "@react-chess/chessground";
import "chessground/assets/chessground.base.css";
import "chessground/assets/chessground.brown.css";
import "chessground/assets/chessground.cburnett.css";
import "../../assets/board.css";
import "../../assets/board-themes.css";
import EvalBar from "./EvalBar";
import WinProbability from "./WinProbability";
import PlayerAvatar from "./PlayerAvatar";
import { useBroadcastSettings } from "../../context/BroadcastSettingsContext";
import { detectCriticalMoment } from "../../utils/critical-moments";

function estimateEloDiff(playerRating, opponentRating, score) {
  if (!playerRating || !opponentRating) return null;
  const pr = parseInt(playerRating);
  const or = parseInt(opponentRating);
  if (isNaN(pr) || isNaN(or)) return null;
  const expected = 1 / (1 + Math.pow(10, (or - pr) / 400));
  const K = 20;
  return Math.round(K * (score - expected));
}

function formatMoveTime(seconds) {
  if (!seconds || seconds <= 0) return null;
  if (seconds >= 60) {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}m${s > 0 ? `${s}s` : ""}`;
  }
  return `${seconds}s`;
}

function PlayerRow({ name, rating, clock, isBlack, isActive, showRatings, showClocks, showAvatars, eloDiff, moveTime, accuracy, showAccuracy }) {
  return (
    <div className="flex items-center justify-between px-3 py-1.5">
      <div className="flex items-center gap-2 min-w-0">
        {showAvatars ? (
          <PlayerAvatar name={name} />
        ) : (
          <div
            className={`w-2.5 h-2.5 rounded-sm flex-shrink-0 ${
              isBlack ? "bg-slate-500" : "bg-white"
            }`}
          />
        )}
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
        {showAccuracy && accuracy != null && (
          <span
            className={`text-[10px] font-mono flex-shrink-0 ${
              accuracy >= 90 ? "text-green-400" : accuracy >= 70 ? "text-yellow-400" : "text-red-400"
            }`}
          >
            {accuracy.toFixed(1)}%
          </span>
        )}
      </div>
      <div className="flex items-center gap-1.5 flex-shrink-0">
        {moveTime && (
          <span className="text-[10px] text-slate-600 tabular-nums">{moveTime}</span>
        )}
        {showClocks && (
          <span className={`text-xs font-mono tabular-nums ${
            isActive ? "text-white" : "text-slate-400"
          }`}>
            {clock}
          </span>
        )}
      </div>
    </div>
  );
}

export default function BoardWrapper({
  name, fen, result, blackClock, whiteClock, whiteActive, blackActive,
  lastMove, lastMoveSan, info, evaluation, opening, flipped, onFlip,
  onClick, isFeatured, lastMoveTime,
}) {
  const { settings } = useBroadcastSettings();
  const isFinished = result && !result.includes("*");
  const [criticalMoment, setCriticalMoment] = useState(null);

  // Critical moment detection
  useEffect(() => {
    if (!settings.showCriticalMoments || !evaluation?.prevEval) return;
    const moment = detectCriticalMoment(evaluation, evaluation.prevEval);
    if (moment) {
      setCriticalMoment(moment);
      const timer = setTimeout(() => setCriticalMoment(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [evaluation, settings.showCriticalMoments]);

  let whiteEloDiff = null;
  let blackEloDiff = null;
  if (settings.showRatingDiff && isFinished && info?.whiteInfo?.rating && info?.blackInfo?.rating) {
    const whiteScore = result === "1-0" ? 1 : result === "0-1" ? 0 : 0.5;
    whiteEloDiff = estimateEloDiff(info.whiteInfo.rating, info.blackInfo.rating, whiteScore);
    blackEloDiff = estimateEloDiff(info.blackInfo.rating, info.whiteInfo.rating, 1 - whiteScore);
  }

  const topPlayer = flipped ? "white" : "black";
  const bottomPlayer = flipped ? "black" : "white";

  // Determine whose turn it is for move time display
  const fenParts = fen ? fen.split(" ") : [];
  const whiteToMove = (fenParts[1] || "w") === "w";
  // Last move was made by the opposite side
  const lastMoveTimeFormatted = formatMoveTime(lastMoveTime);

  const playerProps = {
    white: {
      name: info?.whiteInfo?.name,
      rating: info?.whiteInfo?.rating,
      clock: whiteClock,
      isBlack: false,
      isActive: whiteActive,
      eloDiff: whiteEloDiff,
      moveTime: settings.showMoveTime && !whiteToMove ? lastMoveTimeFormatted : null,
      accuracy: evaluation?.whiteAccuracy,
    },
    black: {
      name: info?.blackInfo?.name,
      rating: info?.blackInfo?.rating,
      clock: blackClock,
      isBlack: true,
      isActive: blackActive,
      eloDiff: blackEloDiff,
      moveTime: settings.showMoveTime && whiteToMove ? lastMoveTimeFormatted : null,
      accuracy: evaluation?.blackAccuracy,
    },
  };

  // Compute best move arrow from engine lines
  const autoShapes = useMemo(() => {
    if (!settings.showBestMoveArrow || !evaluation?.lines?.length) return [];
    const line = evaluation.lines[0];
    if (!line?.pv?.length) return [];
    const uci = line.pv[0];
    if (uci.length < 4) return [];
    return [{ orig: uci.substring(0, 2), dest: uci.substring(2, 4), brush: "green" }];
  }, [evaluation?.lines, settings.showBestMoveArrow]);

  const criticalBadge = criticalMoment ? {
    blunder: { text: "??", color: "bg-red-500" },
    mistake: { text: "?", color: "bg-amber-500" },
    inaccuracy: { text: "?!", color: "bg-yellow-600" },
    brilliant: { text: "!!", color: "bg-teal-500" },
  }[criticalMoment.type] : null;

  return (
    <div
      className={`board-with-eval board-theme-${settings.boardTheme}${onClick ? " cursor-pointer" : ""}${
        isFeatured ? " ring-1 ring-blue-500/40 rounded-lg" : ""
      }`}
      onClick={onClick}
    >
      {settings.showEvalBar && <EvalBar evaluation={evaluation} />}

      <div className={`bg-gh-surface overflow-hidden border border-gh-border flex-1 shadow-lg shadow-black/20 ${
        settings.showEvalBar ? "rounded-r-lg border-l-0" : "rounded-lg"
      }`}>
        <PlayerRow
          {...playerProps[topPlayer]}
          showRatings={settings.showRatings}
          showClocks={settings.showClocks}
          showAvatars={settings.showAvatars}
          showAccuracy={settings.showAccuracy}
        />

        <div className="board-container relative">
          <Chessground
            contained={true}
            config={{
              fen: fen === "start" ? undefined : fen,
              viewOnly: true,
              orientation: flipped ? "black" : "white",
              highlight: { lastMove: settings.showLastMove },
              lastMove: settings.showLastMove ? lastMove || undefined : undefined,
              animation: { enabled: settings.animationSpeed > 0, duration: settings.animationSpeed },
              drawable: {
                enabled: false,
                visible: true,
                autoShapes,
              },
            }}
          />
          {/* Critical moment badge */}
          {criticalBadge && (
            <div className={`absolute top-2 right-2 ${criticalBadge.color} text-white text-xs font-bold px-1.5 py-0.5 rounded shadow-lg animate-bounce`}>
              {criticalBadge.text}
            </div>
          )}
        </div>

        <PlayerRow
          {...playerProps[bottomPlayer]}
          showRatings={settings.showRatings}
          showClocks={settings.showClocks}
          showAvatars={settings.showAvatars}
          showAccuracy={settings.showAccuracy}
        />

        {/* Win probability bar */}
        {settings.showWinProbability && evaluation && !isFinished && (
          <WinProbability evaluation={evaluation} />
        )}

        <div className="flex items-center justify-between px-3 py-1 border-t border-gh-border/40">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-xs text-slate-500 flex-shrink-0">Board {name}</span>
            {settings.showOpening && opening && (
              <span
                className="text-[10px] text-slate-500/70 truncate"
                title={`${opening.eco}: ${opening.name}`}
              >
                {opening.name}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              onClick={(e) => { e.stopPropagation(); onFlip?.(); }}
              className="text-slate-600 hover:text-slate-400 transition-colors"
              title="Flip board"
            >
              <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
              </svg>
            </button>
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
