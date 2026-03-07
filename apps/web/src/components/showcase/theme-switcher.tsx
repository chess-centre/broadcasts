"use client";

import { useState } from "react";

const themes = [
  { name: "Brown", light: "#f0d9b5", dark: "#b58863" },
  { name: "Blue", light: "#dee3e6", dark: "#8ca2ad" },
  { name: "Green", light: "#eeeed2", dark: "#769656" },
  { name: "Midnight", light: "#1a1a2e", dark: "#16213e" },
  { name: "Ice", light: "#e8edf9", dark: "#b0bfdc" },
  { name: "Rosewood", light: "#f4e1d2", dark: "#a0522d" },
];

const accentColors = [
  { name: "Green", color: "#4ade80" },
  { name: "Amber", color: "#fbbf24" },
  { name: "Blue", color: "#60a5fa" },
  { name: "Rose", color: "#fb7185" },
  { name: "Teal", color: "#2dd4bf" },
];

const displayOptions = [
  { key: "evalBar", label: "Evaluation bar" },
  { key: "bestMove", label: "Best move arrow" },
  { key: "opening", label: "Opening name" },
  { key: "clocks", label: "Live clocks" },
] as const;

type DisplayKey = (typeof displayOptions)[number]["key"];

function MiniBoard({
  light,
  dark,
  accent,
  showEvalBar,
  showBestMove,
}: {
  light: string;
  dark: string;
  accent: string;
  showEvalBar: boolean;
  showBestMove: boolean;
}) {
  const squares = [];
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const isLight = (r + c) % 2 === 0;
      squares.push(
        <div
          key={`${r}-${c}`}
          style={{ background: isLight ? light : dark }}
          className="aspect-square"
        />
      );
    }
  }

  return (
    <div className="relative">
      {/* Eval bar */}
      <div
        className="absolute -left-3 top-0 bottom-0 w-2 rounded-full overflow-hidden transition-opacity duration-300"
        style={{ opacity: showEvalBar ? 1 : 0 }}
      >
        <div className="h-[35%] bg-[#334155]" />
        <div className="h-[65%] bg-[#e2e8f0]" />
      </div>
      <div className="grid grid-cols-8 rounded-md overflow-hidden border border-white/10">
        {squares}
      </div>
      {/* Best move arrow overlay */}
      <svg
        className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-300"
        style={{ opacity: showBestMove ? 1 : 0 }}
        viewBox="0 0 8 8"
      >
        <defs>
          <marker
            id="arrowhead"
            markerWidth="2.5"
            markerHeight="2"
            refX="0.5"
            refY="1"
            orient="auto"
          >
            <polygon points="0 0, 2.5 1, 0 2" fill={accent} opacity="0.8" />
          </marker>
        </defs>
        <line
          x1="4.5"
          y1="6.3"
          x2="4.5"
          y2="4.8"
          stroke={accent}
          strokeWidth="0.3"
          opacity="0.6"
          markerEnd="url(#arrowhead)"
        />
      </svg>
    </div>
  );
}

export function ThemeSwitcher() {
  const [activeTheme, setActiveTheme] = useState(0);
  const [activeAccent, setActiveAccent] = useState(0);
  const [toggles, setToggles] = useState<Record<DisplayKey, boolean>>({
    evalBar: true,
    bestMove: true,
    opening: true,
    clocks: true,
  });

  const theme = themes[activeTheme];
  const accent = accentColors[activeAccent];

  function toggle(key: DisplayKey) {
    setToggles((prev) => ({ ...prev, [key]: !prev[key] }));
  }

  return (
    <div className="grid md:grid-cols-2 gap-8 items-center">
      {/* Board preview */}
      <div className="flex justify-center">
        <div className="w-full max-w-[280px]">
          <div
            className="rounded-xl p-4 border transition-all duration-500"
            style={{
              borderColor: `${accent.color}33`,
              background: `linear-gradient(135deg, ${accent.color}08, transparent)`,
            }}
          >
            {/* Player top */}
            <div className="flex items-center justify-between mb-2 px-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ background: `${accent.color}30` }}
                />
                <div>
                  <span className="text-xs font-semibold text-white">
                    Carlsen, M
                  </span>
                  <span className="text-[10px] text-neutral-500 ml-1.5">
                    2830
                  </span>
                </div>
              </div>
              <span
                className="font-mono text-xs text-white tabular-nums transition-opacity duration-300"
                style={{ opacity: toggles.clocks ? 1 : 0 }}
              >
                1:24:07
              </span>
            </div>

            <div className="pl-4">
              <MiniBoard
                light={theme.light}
                dark={theme.dark}
                accent={accent.color}
                showEvalBar={toggles.evalBar}
                showBestMove={toggles.bestMove}
              />
            </div>

            {/* Player bottom */}
            <div className="flex items-center justify-between mt-2 px-1">
              <div className="flex items-center gap-2">
                <div
                  className="w-6 h-6 rounded-full"
                  style={{ background: `${accent.color}30` }}
                />
                <div>
                  <span className="text-xs font-semibold text-white">
                    Nepomniachtchi, I
                  </span>
                  <span className="text-[10px] text-neutral-500 ml-1.5">
                    2795
                  </span>
                </div>
              </div>
              <span
                className="font-mono text-xs tabular-nums transition-opacity duration-300"
                style={{
                  color: accent.color,
                  opacity: toggles.clocks ? 1 : 0,
                }}
              >
                1:18:33
              </span>
            </div>

            {/* Board footer */}
            <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5 px-1">
              <span className="text-[10px] text-neutral-500 font-mono">
                Board 1
              </span>
              <span
                className="text-[10px] text-neutral-500 transition-opacity duration-300"
                style={{ opacity: toggles.opening ? 1 : 0 }}
              >
                Sicilian Defense
              </span>
              <span className="text-[10px] text-neutral-600 font-mono">
                d22
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div>
        <h4 className="text-sm font-semibold text-white mb-3">Board Theme</h4>
        <div className="grid grid-cols-3 gap-2 mb-6">
          {themes.map((t, i) => (
            <button
              key={t.name}
              onClick={() => setActiveTheme(i)}
              className={`flex items-center gap-2 p-2 rounded-lg border transition-all text-left ${
                i === activeTheme
                  ? "border-emerald-500/40 bg-emerald-500/[0.06]"
                  : "border-white/[0.06] hover:border-white/[0.12] bg-white/[0.02]"
              }`}
            >
              <div className="grid grid-cols-2 w-6 h-6 rounded overflow-hidden shrink-0">
                <div style={{ background: t.light }} />
                <div style={{ background: t.dark }} />
                <div style={{ background: t.dark }} />
                <div style={{ background: t.light }} />
              </div>
              <span className="text-xs text-neutral-300">{t.name}</span>
            </button>
          ))}
        </div>

        <h4 className="text-sm font-semibold text-white mb-3">Accent Color</h4>
        <div className="flex gap-2 mb-6">
          {accentColors.map((a, i) => (
            <button
              key={a.name}
              onClick={() => setActiveAccent(i)}
              className={`w-9 h-9 rounded-full border-2 transition-all ${
                i === activeAccent
                  ? "border-white scale-110"
                  : "border-transparent hover:scale-105"
              }`}
              style={{ background: a.color }}
              title={a.name}
            />
          ))}
        </div>

        <h4 className="text-sm font-semibold text-white mb-3">Display</h4>
        <div className="space-y-2">
          {displayOptions.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => toggle(key)}
              className="flex items-center justify-between py-1 w-full text-left"
            >
              <span className="text-xs text-neutral-400">{label}</span>
              <div
                className={`w-8 h-[18px] rounded-full relative transition-colors duration-200 ${
                  toggles[key] ? "bg-emerald-500" : "bg-neutral-700"
                }`}
              >
                <div
                  className={`absolute top-0.5 w-3.5 h-3.5 rounded-full bg-white transition-all duration-200 ${
                    toggles[key] ? "right-0.5" : "left-0.5"
                  }`}
                />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
