"use client";

import { useState, useEffect } from "react";

const boards = [
  {
    white: "Carlsen, M",
    black: "Nepomniachtchi, I",
    wRating: 2830,
    bRating: 2795,
    eval: 0.4,
    move: "e4",
    wClock: "1:24:07",
    bClock: "1:18:33",
    theme: { light: "#f0d9b5", dark: "#b58863" },
  },
  {
    white: "Firouzja, A",
    black: "Caruana, F",
    wRating: 2785,
    bRating: 2775,
    eval: -1.2,
    move: "Nxe5",
    wClock: "0:45:12",
    bClock: "0:52:48",
    theme: { light: "#eeeed2", dark: "#769656" },
  },
  {
    white: "Ding, L",
    black: "Gukesh, D",
    wRating: 2780,
    bRating: 2758,
    eval: 0.0,
    move: "Rd1",
    wClock: "0:33:55",
    bClock: "0:41:20",
    theme: { light: "#dee3e6", dark: "#8ca2ad" },
  },
  {
    white: "Praggnanandhaa, R",
    black: "Nakamura, H",
    wRating: 2747,
    bRating: 2760,
    eval: 2.1,
    move: "Qh5+",
    wClock: "0:15:42",
    bClock: "0:08:15",
    theme: { light: "#f4e1d2", dark: "#a0522d" },
  },
];

function MiniGrid({ light, dark }: { light: string; dark: string }) {
  const squares = [];
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      squares.push(
        <div
          key={`${r}${c}`}
          style={{ background: (r + c) % 2 === 0 ? light : dark }}
          className="aspect-square"
        />
      );
    }
  }
  return (
    <div className="grid grid-cols-4 rounded overflow-hidden">{squares}</div>
  );
}

export function BoardGridDemo() {
  const [featured, setFeatured] = useState(0);
  const [evals, setEvals] = useState(boards.map((b) => b.eval));

  useEffect(() => {
    const interval = setInterval(() => {
      setFeatured((f) => (f + 1) % boards.length);
      setEvals((prev) =>
        prev.map((e) => {
          const delta = (Math.random() - 0.5) * 0.4;
          return Math.round((e + delta) * 10) / 10;
        })
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="grid grid-cols-2 gap-2">
      {boards.map((board, i) => {
        const ev = evals[i];
        const isFeatured = i === featured;
        const pct = Math.max(8, Math.min(92, 50 + ev * 9));

        return (
          <button
            key={i}
            onClick={() => setFeatured(i)}
            className={`text-left rounded-lg p-2.5 border transition-all duration-500 ${
              isFeatured
                ? "border-blue-500/40 bg-blue-500/[0.04] ring-1 ring-blue-500/20"
                : "border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04]"
            }`}
          >
            <div className="flex gap-2">
              {/* Eval bar */}
              <div className="w-1.5 rounded-full overflow-hidden shrink-0 self-stretch">
                <div
                  className="bg-[#334155] transition-all duration-700"
                  style={{ height: `${100 - pct}%` }}
                />
                <div className="bg-[#e2e8f0] flex-1 h-full" />
              </div>

              {/* Board */}
              <div className="w-16 shrink-0">
                <MiniGrid light={board.theme.light} dark={board.theme.dark} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0 overflow-hidden">
                <div className="flex items-center gap-1 mb-0.5">
                  <div className="w-2 h-2 rounded-sm bg-white shrink-0" />
                  <span className="text-[10px] text-white truncate font-medium">
                    {board.white.split(",")[0]}
                  </span>
                </div>
                <div className="flex items-center gap-1 mb-1.5">
                  <div className="w-2 h-2 rounded-sm bg-neutral-700 shrink-0" />
                  <span className="text-[10px] text-neutral-400 truncate">
                    {board.black.split(",")[0]}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <span
                    className={`text-[10px] font-mono font-bold tabular-nums shrink-0 ${
                      ev > 0.5
                        ? "text-white"
                        : ev < -0.5
                          ? "text-neutral-400"
                          : "text-neutral-500"
                    }`}
                  >
                    {ev > 0 ? "+" : ""}
                    {ev.toFixed(1)}
                  </span>
                  {isFeatured && (
                    <span className="text-[7px] font-mono text-blue-400 uppercase tracking-wide truncate">
                      Featured
                    </span>
                  )}
                </div>
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
