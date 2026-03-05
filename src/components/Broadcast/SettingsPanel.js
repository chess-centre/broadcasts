import { Fragment } from "react";
import { Transition } from "@headlessui/react";
import { useBroadcastSettings } from "../../context/BroadcastSettingsContext";

const BOARD_THEMES = [
  { id: "brown", label: "Brown", light: "#f0d9b5", dark: "#b58863" },
  { id: "blue", label: "Blue", light: "#dee3e6", dark: "#8ca2ad" },
  { id: "green", label: "Green", light: "#eeeed2", dark: "#769656" },
  { id: "midnight", label: "Midnight", light: "#1a1a2e", dark: "#16213e" },
  { id: "ice", label: "Ice", light: "#e8edf9", dark: "#b0bfdc" },
  { id: "rosewood", label: "Rosewood", light: "#f4e1d2", dark: "#a0522d" },
];

const ACCENT_COLORS = [
  { id: "green", color: "#4ade80" },
  { id: "amber", color: "#fbbf24" },
  { id: "blue", color: "#60a5fa" },
  { id: "rose", color: "#fb7185" },
  { id: "teal", color: "#2dd4bf" },
];

const SPEED_OPTIONS = [
  { value: 0, label: "None" },
  { value: 150, label: "Fast" },
  { value: 300, label: "Normal" },
  { value: 500, label: "Slow" },
];

function Toggle({ label, enabled, onChange }) {
  return (
    <button
      onClick={() => onChange(!enabled)}
      className="flex items-center justify-between w-full py-1.5 group"
    >
      <span className="text-xs text-slate-300 group-hover:text-slate-100 transition-colors">
        {label}
      </span>
      <div
        className={`relative w-8 h-4 rounded-full transition-colors ${
          enabled ? "bg-green-600" : "bg-slate-700"
        }`}
      >
        <div
          className={`absolute top-0.5 h-3 w-3 rounded-full bg-white shadow transition-transform ${
            enabled ? "translate-x-4" : "translate-x-0.5"
          }`}
        />
      </div>
    </button>
  );
}

function SectionTitle({ children }) {
  return (
    <h3 className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2 mt-4 first:mt-0">
      {children}
    </h3>
  );
}

export default function SettingsPanel({ open, onClose }) {
  const { settings, updateSetting } = useBroadcastSettings();

  return (
    <>
      {/* Backdrop */}
      <Transition
        show={open}
        as={Fragment}
        enter="transition-opacity duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={onClose}
        />
      </Transition>

      {/* Panel */}
      <Transition
        show={open}
        as={Fragment}
        enter="transition-transform duration-250 ease-out"
        enterFrom="translate-x-full"
        enterTo="translate-x-0"
        leave="transition-transform duration-200 ease-in"
        leaveFrom="translate-x-0"
        leaveTo="translate-x-full"
      >
        <div className="fixed right-0 top-0 bottom-0 w-72 bg-gh-surface border-l border-gh-border z-50 overflow-y-auto shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gh-border">
            <span className="text-sm font-semibold text-slate-200">
              Display Settings
            </span>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="px-4 py-3">
            {/* Board Theme */}
            <SectionTitle>Board Theme</SectionTitle>
            <div className="grid grid-cols-3 gap-2">
              {BOARD_THEMES.map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => updateSetting("boardTheme", theme.id)}
                  className={`relative rounded-md overflow-hidden border-2 transition-all ${
                    settings.boardTheme === theme.id
                      ? "border-blue-500 ring-1 ring-blue-500/30"
                      : "border-gh-border hover:border-slate-500"
                  }`}
                >
                  {/* Mini board preview: 2x2 grid */}
                  <div className="aspect-square grid grid-cols-2">
                    <div style={{ backgroundColor: theme.light }} />
                    <div style={{ backgroundColor: theme.dark }} />
                    <div style={{ backgroundColor: theme.dark }} />
                    <div style={{ backgroundColor: theme.light }} />
                  </div>
                  <div className="text-[9px] text-center py-0.5 text-slate-400 bg-gh-bg/50">
                    {theme.label}
                  </div>
                </button>
              ))}
            </div>

            {/* Board Display */}
            <SectionTitle>Board Display</SectionTitle>
            <Toggle
              label="Evaluation bar"
              enabled={settings.showEvalBar}
              onChange={(v) => updateSetting("showEvalBar", v)}
            />
            <Toggle
              label="Last move highlight"
              enabled={settings.showLastMove}
              onChange={(v) => updateSetting("showLastMove", v)}
            />
            <div className="flex items-center justify-between py-1.5">
              <span className="text-xs text-slate-300">Animation</span>
              <div className="flex gap-1">
                {SPEED_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => updateSetting("animationSpeed", opt.value)}
                    className={`text-[10px] px-2 py-0.5 rounded transition-colors ${
                      settings.animationSpeed === opt.value
                        ? "bg-blue-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Player Info */}
            <SectionTitle>Player Info</SectionTitle>
            <Toggle
              label="Show ratings"
              enabled={settings.showRatings}
              onChange={(v) => updateSetting("showRatings", v)}
            />
            <Toggle
              label="Show clocks"
              enabled={settings.showClocks}
              onChange={(v) => updateSetting("showClocks", v)}
            />
            <Toggle
              label="Rating change (+/-)"
              enabled={settings.showRatingDiff}
              onChange={(v) => updateSetting("showRatingDiff", v)}
            />

            {/* Standings */}
            <SectionTitle>Standings</SectionTitle>
            <Toggle
              label="Show ratings"
              enabled={settings.standingsShowRatings}
              onChange={(v) => updateSetting("standingsShowRatings", v)}
            />
            <Toggle
              label="Show W/D/L record"
              enabled={settings.standingsShowRecord}
              onChange={(v) => updateSetting("standingsShowRecord", v)}
            />
            <Toggle
              label="Show games played"
              enabled={settings.standingsShowPlayed}
              onChange={(v) => updateSetting("standingsShowPlayed", v)}
            />

            {/* Accent Color */}
            <SectionTitle>Accent Color</SectionTitle>
            <div className="flex gap-2">
              {ACCENT_COLORS.map((accent) => (
                <button
                  key={accent.id}
                  onClick={() => updateSetting("accentColor", accent.id)}
                  className={`w-6 h-6 rounded-full transition-all ${
                    settings.accentColor === accent.id
                      ? "ring-2 ring-offset-2 ring-offset-gh-surface"
                      : "hover:scale-110"
                  }`}
                  style={{
                    backgroundColor: accent.color,
                    ringColor: settings.accentColor === accent.id ? accent.color : undefined,
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </Transition>
    </>
  );
}
