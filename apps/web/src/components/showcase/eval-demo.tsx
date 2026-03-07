"use client";

import { useState, useEffect } from "react";

const moves = [
  { move: "1. e4", eval: 0.3, best: true },
  { move: "1... c5", eval: 0.5, best: true },
  { move: "2. Nf3", eval: 0.3, best: true },
  { move: "2... d6", eval: 0.4, best: true },
  { move: "3. d4", eval: 0.5, best: true },
  { move: "3... cxd4", eval: 0.5, best: true },
  { move: "4. Nxd4", eval: 0.4, best: true },
  { move: "4... Nf6", eval: 0.3, best: true },
  { move: "5. Nc3", eval: 0.4, best: true },
  { move: "5... a6", eval: 0.5, best: true },
  { move: "6. Be3", eval: 0.3, best: true },
  { move: "6... e5?!", eval: 1.2, best: false },
  { move: "7. Nb3", eval: 0.8, best: true },
  { move: "7... Be7", eval: 0.9, best: true },
  { move: "8. Qd2?", eval: 0.1, best: false },
  { move: "8... O-O", eval: 0.2, best: true },
];

function EvalBar({ value }: { value: number }) {
  // Convert eval to percentage (from white's perspective)
  // +5 = 95% white, -5 = 5% white
  const pct = Math.max(5, Math.min(95, 50 + value * 9));

  return (
    <div className="w-5 h-full rounded-full overflow-hidden flex flex-col border border-white/10">
      <div
        className="bg-[#334155] transition-all duration-700 ease-out"
        style={{ height: `${100 - pct}%` }}
      />
      <div
        className="bg-[#e2e8f0] transition-all duration-700 ease-out flex-1"
      />
    </div>
  );
}

export function EvalDemo() {
  const [currentMove, setCurrentMove] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setCurrentMove((m) => (m + 1) % moves.length);
    }, 1800);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const move = moves[currentMove];

  return (
    <div className="space-y-4">
      {/* Engine analysis header */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
            Stockfish 16
          </span>
        </div>
        <span className="text-[10px] text-neutral-600 font-mono">
          depth 22 / MultiPV 3
        </span>
      </div>

      {/* Analysis display */}
      <div className="flex gap-3">
        <EvalBar value={move.eval} />
        <div className="flex-1 space-y-1.5">
          {/* Primary line */}
          <div className="flex items-center gap-2">
            <span
              className={`font-mono text-lg font-bold tabular-nums ${
                move.eval > 0 ? "text-white" : "text-neutral-400"
              }`}
            >
              {move.eval > 0 ? "+" : ""}
              {move.eval.toFixed(1)}
            </span>
            <span className="text-xs text-neutral-500">
              Win: {Math.round(50 + move.eval * 9)}%
            </span>
          </div>

          {/* Move list */}
          <div className="flex flex-wrap gap-1">
            {moves.slice(0, currentMove + 1).map((m, i) => (
              <span
                key={i}
                className={`text-[11px] font-mono px-1 py-0.5 rounded transition-all ${
                  i === currentMove
                    ? "bg-emerald-500/20 text-emerald-300"
                    : !m.best
                      ? "text-amber-400/80"
                      : "text-neutral-500"
                }`}
              >
                {m.move}
                {!m.best && (
                  <span className="text-amber-400 ml-0.5">
                    {m.eval > 0.8 ? "?!" : "?"}
                  </span>
                )}
              </span>
            ))}
          </div>

          {/* Engine lines */}
          <div className="space-y-1 pt-2 border-t border-white/5">
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-neutral-600 font-mono w-4">
                1.
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">
                Nf3 Nc6 Bb5 a6 Ba4
              </span>
              <span className="text-[10px] text-emerald-400 font-mono ml-auto">
                +{move.eval.toFixed(1)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-neutral-600 font-mono w-4">
                2.
              </span>
              <span className="text-[10px] text-neutral-500 font-mono">
                Bc4 Nc6 O-O Be7
              </span>
              <span className="text-[10px] text-neutral-500 font-mono ml-auto">
                +{(move.eval - 0.2).toFixed(1)}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-neutral-600 font-mono w-4">
                3.
              </span>
              <span className="text-[10px] text-neutral-600 font-mono">
                d3 Nc6 Be2 g6
              </span>
              <span className="text-[10px] text-neutral-600 font-mono ml-auto">
                +{(move.eval - 0.4).toFixed(1)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Playback controls */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="text-[10px] font-mono text-neutral-500 hover:text-white transition-colors"
        >
          {isPlaying ? "PAUSE" : "PLAY"}
        </button>
        <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
          <div
            className="h-full bg-emerald-500/40 rounded-full transition-all duration-300"
            style={{ width: `${((currentMove + 1) / moves.length) * 100}%` }}
          />
        </div>
        <span className="text-[10px] text-neutral-600 font-mono">
          {currentMove + 1}/{moves.length}
        </span>
      </div>
    </div>
  );
}
