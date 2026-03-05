import { Fragment, useState, useEffect, useCallback, useMemo } from "react";
import { Transition } from "@headlessui/react";
import Chessground from "@react-chess/chessground";
import { usePGN } from "../../hooks/usePgn";
import { useBroadcastSettings } from "../../context/BroadcastSettingsContext";
import { detectOpening } from "../../data/openings";
import { parsePgnFull } from "./Game";
import EvalBar from "../Board/EvalBar";
import PlayerAvatar from "../Board/PlayerAvatar";
import MoveList from "./MoveList";
import MoveTimeChart from "./MoveTimeChart";
import { formatScore, uciToSan } from "../../utils/eval";

export default function GameViewerModal({ board, onClose }) {
  const { gameState, evaluation } = usePGN(board);
  const { settings } = useBroadcastSettings();
  const [viewIndex, setViewIndex] = useState(-1); // -1 = follow live
  const [flipped, setFlipped] = useState(false);

  const history = useMemo(() => {
    if (!gameState?.pgn) return [{ fen: "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1", san: null }];
    return parsePgnFull(gameState.pgn);
  }, [gameState?.pgn]);

  const isLive = viewIndex === -1;
  const currentIndex = isLive ? history.length - 1 : viewIndex;
  const currentPos = history[currentIndex] || history[history.length - 1];

  const opening = useMemo(() => {
    const moves = history.slice(1).map((h) => h.san).filter(Boolean);
    return detectOpening(moves);
  }, [history]);

  const isFinished = gameState?.gameResult && !gameState.gameResult.includes("*");

  // Trigger a resize so Chessground recalculates board dimensions after modal opens
  useEffect(() => {
    const timer = setTimeout(() => window.dispatchEvent(new Event("resize")), 100);
    return () => clearTimeout(timer);
  }, []);

  const navigate = useCallback((idx) => {
    setViewIndex(idx);
  }, []);

  const goLive = useCallback(() => setViewIndex(-1), []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      switch (e.key) {
        case "ArrowLeft":
          e.preventDefault();
          setViewIndex((prev) => {
            const cur = prev === -1 ? history.length - 1 : prev;
            return Math.max(0, cur - 1);
          });
          break;
        case "ArrowRight":
          e.preventDefault();
          setViewIndex((prev) => {
            if (prev === -1) return -1;
            return prev >= history.length - 1 ? -1 : prev + 1;
          });
          break;
        case "Home":
          e.preventDefault();
          setViewIndex(0);
          break;
        case "End":
          e.preventDefault();
          setViewIndex(-1);
          break;
        case "Escape":
          e.preventDefault();
          onClose();
          break;
        default:
          break;
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [history.length, onClose]);

  const lastMoveSquares = currentIndex > 0 && history[currentIndex]
    ? [history[currentIndex].from, history[currentIndex].to].filter(Boolean)
    : undefined;

  // Compute arrows for all 3 engine lines in modal (only when live)
  const modalAutoShapes = useMemo(() => {
    if (!settings.showBestMoveArrow || !isLive || !evaluation?.lines?.length) return [];
    const brushMap = { 1: "green", 2: "blue", 3: "yellow" };
    return evaluation.lines
      .map((line) => {
        if (!line?.pv?.length || line.pv[0].length < 4) return null;
        const uci = line.pv[0];
        return { orig: uci.substring(0, 2), dest: uci.substring(2, 4), brush: brushMap[line.rank] || "green" };
      })
      .filter(Boolean);
  }, [evaluation?.lines, settings.showBestMoveArrow, isLive]);

  return (
    <>
      <Transition
        show={true}
        as={Fragment}
        appear
        enter="transition-opacity duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
      >
        <div className="fixed inset-0 bg-black/70 z-50" onClick={onClose} />
      </Transition>

      <Transition
        show={true}
        as={Fragment}
        appear
        enter="transition-all duration-250 ease-out"
        enterFrom="opacity-0 scale-95"
        enterTo="opacity-100 scale-100"
      >
        <div className="fixed inset-4 z-50 flex items-center justify-center" onClick={onClose}>
          <div
            className="bg-gh-surface border border-gh-border rounded-lg max-w-5xl w-full h-full overflow-hidden flex shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left: Board */}
            <div className={`flex-1 p-4 flex flex-col board-theme-${settings.boardTheme}`}>
              {/* Top player */}
              <PlayerInfo
                info={flipped ? gameState?.whiteInfo : gameState?.blackInfo}
                clock={flipped ? gameState?.whiteClock : gameState?.blackClock}
                isBlack={!flipped}
                settings={settings}
                accuracy={flipped ? evaluation?.whiteAccuracy : evaluation?.blackAccuracy}
              />

              <div className="flex flex-1 min-h-0">
                {settings.showEvalBar && (
                  <EvalBar evaluation={isLive ? evaluation : null} />
                )}
                <div className="board-modal-outer">
                  <div className="board-container">
                    <Chessground
                      contained={true}
                      config={{
                        fen: currentPos.fen,
                        viewOnly: true,
                        orientation: flipped ? "black" : "white",
                        highlight: { lastMove: settings.showLastMove },
                        lastMove: settings.showLastMove ? lastMoveSquares : undefined,
                        animation: { enabled: settings.animationSpeed > 0, duration: settings.animationSpeed },
                        drawable: {
                          enabled: false,
                          visible: true,
                          autoShapes: modalAutoShapes,
                        },
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Bottom player */}
              <PlayerInfo
                info={flipped ? gameState?.blackInfo : gameState?.whiteInfo}
                clock={flipped ? gameState?.blackClock : gameState?.whiteClock}
                isBlack={flipped}
                settings={settings}
                accuracy={flipped ? evaluation?.blackAccuracy : evaluation?.whiteAccuracy}
              />
            </div>

            {/* Right: Sidebar */}
            <div className="w-64 border-l border-gh-border flex flex-col bg-gh-bg/50">
              {/* Header */}
              <div className="px-3 py-2 border-b border-gh-border">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold text-slate-300">Board {board}</span>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setFlipped((f) => !f)}
                      className="text-slate-500 hover:text-slate-300 transition-colors p-1"
                      title="Flip board"
                    >
                      <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                      </svg>
                    </button>
                    <button
                      onClick={onClose}
                      className="text-slate-500 hover:text-slate-300 transition-colors p-1"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
                {opening && (
                  <span className="text-[10px] text-slate-500">{opening.eco} {opening.name}</span>
                )}
              </div>

              {/* Engine lines */}
              {settings.showEngineLines && isLive && evaluation?.lines?.length > 0 && (
                <EngineLines evaluation={evaluation} fen={currentPos.fen} />
              )}

              {/* Move list */}
              <MoveList
                history={history}
                currentIndex={currentIndex}
                onNavigate={navigate}
              />

              {/* Move time chart */}
              {settings.showMoveTimeChart && gameState?.pgn && (
                <div className="border-t border-gh-border">
                  <MoveTimeChart pgn={gameState.pgn} />
                </div>
              )}

              {/* Navigation controls */}
              <div className="px-3 py-2 border-t border-gh-border flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <NavButton onClick={() => navigate(0)} title="Start">
                    {"⏮"}
                  </NavButton>
                  <NavButton onClick={() => navigate(Math.max(0, currentIndex - 1))} title="Back">
                    {"◀"}
                  </NavButton>
                  <NavButton
                    onClick={() => navigate(currentIndex >= history.length - 1 ? -1 : currentIndex + 1)}
                    title="Forward"
                  >
                    {"▶"}
                  </NavButton>
                  <NavButton onClick={goLive} title="Latest">
                    {"⏭"}
                  </NavButton>
                </div>
                <button
                  onClick={goLive}
                  className={`text-[10px] px-2 py-0.5 rounded transition-colors ${
                    isLive
                      ? "bg-green-600/30 text-green-400"
                      : "bg-slate-700 text-slate-400 hover:text-white"
                  }`}
                >
                  {isLive ? "LIVE" : "Go Live"}
                </button>
              </div>

              {/* Result / status */}
              {isFinished && (
                <div className="px-3 py-2 border-t border-gh-border text-center">
                  <span className="text-sm font-bold text-amber-400">{gameState.gameResult}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </Transition>
    </>
  );
}

function PlayerInfo({ info, clock, isBlack, settings, accuracy }) {
  return (
    <div className="flex items-center justify-between px-1 py-1.5">
      <div className="flex items-center gap-2 min-w-0">
        {settings.showAvatars ? (
          <PlayerAvatar name={info?.name} />
        ) : (
          <div className={`w-3 h-3 rounded-sm ${isBlack ? "bg-slate-500" : "bg-white"}`} />
        )}
        <span className="text-sm text-slate-200 truncate">{info?.name || "---"}</span>
        {settings.showRatings && info?.rating && (
          <span className="text-xs text-slate-500">{info.rating}</span>
        )}
        {settings.showAccuracy && accuracy != null && (
          <span
            className={`text-[10px] font-mono flex-shrink-0 ${
              accuracy >= 90 ? "text-green-400" : accuracy >= 70 ? "text-yellow-400" : "text-red-400"
            }`}
          >
            {accuracy.toFixed(1)}%
          </span>
        )}
      </div>
      {settings.showClocks && clock && (
        <span className="text-sm font-mono text-slate-300 tabular-nums">{clock}</span>
      )}
    </div>
  );
}

function EngineLines({ evaluation, fen }) {
  const colorMap = {
    1: "text-green-400",
    2: "text-blue-400",
    3: "text-yellow-400",
  };

  return (
    <div className="px-3 py-2 border-b border-gh-border">
      <div className="text-[10px] text-slate-500 mb-1">Engine Lines</div>
      {evaluation.lines.map((line) => (
        <div key={line.rank} className="flex items-baseline gap-1.5 py-0.5">
          <span
            className={`text-[10px] font-mono font-bold flex-shrink-0 w-8 ${colorMap[line.rank] || "text-slate-400"}`}
          >
            {formatScore(line.type, line.value)}
          </span>
          <span className="text-[10px] text-slate-400 font-mono truncate">
            {uciToSan(fen, line.pv, 6)}
          </span>
        </div>
      ))}
    </div>
  );
}

function NavButton({ children, onClick, title }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className="w-7 h-7 flex items-center justify-center rounded text-xs text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
    >
      {children}
    </button>
  );
}
