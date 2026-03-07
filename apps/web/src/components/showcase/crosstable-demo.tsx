"use client";

import { useState, useEffect } from "react";

const players = [
  { name: "Carlsen", rating: 2830, score: 5.5 },
  { name: "Nepomniachtchi", rating: 2795, score: 5.0 },
  { name: "Firouzja", rating: 2785, score: 4.5 },
  { name: "Ding", rating: 2780, score: 4.0 },
  { name: "Caruana", rating: 2775, score: 3.5 },
  { name: "Gukesh", rating: 2758, score: 3.0 },
];

// Results matrix: results[i][j] = result of player i vs player j
const results: (string | null)[][] = [
  [null, "1", "½", "1", "1", "1"],
  ["0", null, "1", "½", "1", "1"],
  ["½", "0", null, "1", "1", "1"],
  ["0", "½", "0", null, "1", "1"],
  ["0", "0", "0", "0", null, "1"],
  ["0", "0", "0", "0", "0", null],
];

function resultColor(r: string | null) {
  if (r === "1") return "text-emerald-400";
  if (r === "0") return "text-red-400";
  if (r === "½") return "text-neutral-300";
  return "text-neutral-700";
}

export function CrosstableDemo() {
  const [highlightRow, setHighlightRow] = useState<number | null>(null);
  const [animatedCells, setAnimatedCells] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnimatedCells((c) => {
        if (c >= players.length * players.length) {
          clearInterval(timer);
          return c;
        }
        return c + 1;
      });
    }, 60);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <span className="text-[10px] font-mono text-emerald-400 uppercase tracking-wider">
          Live Standings
        </span>
        <span className="text-[10px] text-neutral-600 font-mono ml-auto">
          Round 5 of 10
        </span>
      </div>

      {/* Crosstable */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left py-2 pr-4 text-neutral-500 font-mono font-normal w-8">
                #
              </th>
              <th className="text-left py-2 pr-4 text-neutral-500 font-normal">
                Player
              </th>
              <th className="text-right py-2 pr-3 text-neutral-600 font-mono font-normal">
                Rtg
              </th>
              {players.map((_, i) => (
                <th
                  key={i}
                  className="text-center py-2 w-8 text-neutral-600 font-mono font-normal"
                >
                  {i + 1}
                </th>
              ))}
              <th className="text-right py-2 pl-3 text-neutral-500 font-mono font-normal">
                Pts
              </th>
            </tr>
          </thead>
          <tbody>
            {players.map((p, i) => (
              <tr
                key={p.name}
                className={`border-b border-white/[0.03] transition-colors ${
                  highlightRow === i ? "bg-white/[0.04]" : ""
                }`}
                onMouseEnter={() => setHighlightRow(i)}
                onMouseLeave={() => setHighlightRow(null)}
              >
                <td className="py-2 pr-4 font-mono text-neutral-500">
                  {i + 1}
                </td>
                <td className="py-2 pr-4 font-semibold text-white whitespace-nowrap">
                  {p.name}
                </td>
                <td className="py-2 pr-3 font-mono text-neutral-600 text-right">
                  {p.rating}
                </td>
                {results[i].map((r, j) => {
                  const cellIndex = i * players.length + j;
                  const isVisible = cellIndex < animatedCells;
                  return (
                    <td
                      key={j}
                      className={`text-center py-2 w-8 font-mono font-semibold transition-all duration-300 ${
                        i === j
                          ? "bg-white/[0.02]"
                          : highlightRow === i || highlightRow === j
                            ? "bg-white/[0.03]"
                            : ""
                      } ${isVisible ? "opacity-100" : "opacity-0"}`}
                    >
                      <span className={i === j ? "text-neutral-700" : resultColor(r)}>
                        {i === j ? "-" : (r ?? "·")}
                      </span>
                    </td>
                  );
                })}
                <td className="py-2 pl-3 font-mono font-bold text-right text-white tabular-nums">
                  {p.score}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Standings summary */}
      <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
        <div className="flex gap-4 text-[10px]">
          <span className="text-emerald-400">1 = Win</span>
          <span className="text-neutral-300">½ = Draw</span>
          <span className="text-red-400">0 = Loss</span>
        </div>
        <span className="text-[10px] text-neutral-600 font-mono">
          6 players · Round Robin
        </span>
      </div>
    </div>
  );
}
