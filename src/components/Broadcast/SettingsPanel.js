import { Fragment, useState } from "react";
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
            <Toggle
              label="Opening name"
              enabled={settings.showOpening}
              onChange={(v) => updateSetting("showOpening", v)}
            />
            <Toggle
              label="Win probability"
              enabled={settings.showWinProbability}
              onChange={(v) => updateSetting("showWinProbability", v)}
            />
            <Toggle
              label="Critical moments"
              enabled={settings.showCriticalMoments}
              onChange={(v) => updateSetting("showCriticalMoments", v)}
            />
            <Toggle
              label="Engine lines"
              enabled={settings.showEngineLines}
              onChange={(v) => updateSetting("showEngineLines", v)}
            />
            <Toggle
              label="Best move arrow"
              enabled={settings.showBestMoveArrow}
              onChange={(v) => updateSetting("showBestMoveArrow", v)}
            />
            <Toggle
              label="Move time chart"
              enabled={settings.showMoveTimeChart}
              onChange={(v) => updateSetting("showMoveTimeChart", v)}
            />
            <Toggle
              label="Featured board"
              enabled={settings.showFeaturedBoard}
              onChange={(v) => updateSetting("showFeaturedBoard", v)}
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
            <Toggle
              label="Player avatars"
              enabled={settings.showAvatars}
              onChange={(v) => updateSetting("showAvatars", v)}
            />
            <Toggle
              label="Animate clocks"
              enabled={settings.animateClocks}
              onChange={(v) => updateSetting("animateClocks", v)}
            />
            <Toggle
              label="Move time spent"
              enabled={settings.showMoveTime}
              onChange={(v) => updateSetting("showMoveTime", v)}
            />
            <Toggle
              label="Player accuracy"
              enabled={settings.showAccuracy}
              onChange={(v) => updateSetting("showAccuracy", v)}
            />
            <Toggle
              label="Sound effects"
              enabled={settings.soundEnabled}
              onChange={(v) => updateSetting("soundEnabled", v)}
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

            {/* TV / Kiosk Mode */}
            <SectionTitle>TV / Kiosk Mode</SectionTitle>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-xs text-slate-300">Cycle interval</span>
              <div className="flex gap-1">
                {[15, 30, 60].map((sec) => (
                  <button
                    key={sec}
                    onClick={() => updateSetting("autoCycleInterval", sec)}
                    className={`text-[10px] px-2 py-0.5 rounded transition-colors ${
                      settings.autoCycleInterval === sec
                        ? "bg-blue-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {sec}s
                  </button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between py-1.5">
              <span className="text-xs text-slate-300">Standings every</span>
              <div className="flex gap-1">
                {[2, 3, 5].map((n) => (
                  <button
                    key={n}
                    onClick={() => updateSetting("autoCycleLeaderboardEvery", n)}
                    className={`text-[10px] px-2 py-0.5 rounded transition-colors ${
                      settings.autoCycleLeaderboardEvery === n
                        ? "bg-blue-600 text-white"
                        : "bg-slate-800 text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </div>

            {/* Branding */}
            <SectionTitle>Branding</SectionTitle>
            <Toggle
              label="Show branding"
              enabled={settings.brandingEnabled}
              onChange={(v) => updateSetting("brandingEnabled", v)}
            />
            {settings.brandingEnabled && (
              <div className="space-y-2 mt-1">
                <input
                  value={settings.brandingEventTitle}
                  onChange={(e) => updateSetting("brandingEventTitle", e.target.value)}
                  placeholder="Event title"
                  className="w-full bg-gh-bg border border-gh-border text-gh-text font-mono text-xs rounded px-2 py-1 focus:border-blue-500 focus:outline-none"
                />
                <input
                  value={settings.brandingSubtitle}
                  onChange={(e) => updateSetting("brandingSubtitle", e.target.value)}
                  placeholder="Subtitle"
                  className="w-full bg-gh-bg border border-gh-border text-gh-text font-mono text-xs rounded px-2 py-1 focus:border-blue-500 focus:outline-none"
                />
                <div>
                  <div className="flex items-center gap-1.5">
                    <input
                      value={settings.brandingLogoUrl}
                      onChange={(e) => updateSetting("brandingLogoUrl", e.target.value)}
                      placeholder="Logo URL"
                      className="flex-1 bg-gh-bg border border-gh-border text-gh-text font-mono text-xs rounded px-2 py-1 focus:border-blue-500 focus:outline-none"
                    />
                    <label className="px-2 py-1 text-[10px] bg-slate-700 text-slate-300 rounded cursor-pointer hover:bg-slate-600 transition-colors">
                      Upload
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          const reader = new FileReader();
                          reader.onload = () => updateSetting("brandingLogoUrl", reader.result);
                          reader.readAsDataURL(file);
                        }}
                      />
                    </label>
                  </div>
                  {settings.brandingLogoUrl && (
                    <div className="mt-1 flex items-center gap-2">
                      <img src={settings.brandingLogoUrl} alt="" className="h-6 w-auto object-contain rounded" />
                      <button
                        onClick={() => updateSetting("brandingLogoUrl", "")}
                        className="text-[10px] text-red-400 hover:text-red-300"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
                <input
                  value={settings.brandingTickerText}
                  onChange={(e) => updateSetting("brandingTickerText", e.target.value)}
                  placeholder="Ticker text (scrolling bar)"
                  className="w-full bg-gh-bg border border-gh-border text-gh-text font-mono text-xs rounded px-2 py-1 focus:border-blue-500 focus:outline-none"
                />
              </div>
            )}

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
            {/* OBS / Streaming */}
            <SectionTitle>OBS / Streaming</SectionTitle>
            <p className="text-[10px] text-slate-500 mb-2">
              Add these as Browser Sources in OBS:
            </p>
            <OBSUrlList />
          </div>
        </div>
      </Transition>
    </>
  );
}

function OBSUrlList() {
  const base = `${window.location.protocol}//${window.location.host}`;
  const urls = [
    { label: "Board 1", url: `${base}/obs?type=board&board=1&round=1` },
    { label: "Featured", url: `${base}/obs?type=featured&round=1` },
    { label: "Standings", url: `${base}/obs?type=standings&round=1` },
    { label: "Ticker", url: `${base}/obs?type=ticker&round=1` },
  ];
  const [copied, setCopied] = useState(null);

  const handleCopy = async (url, idx) => {
    await navigator.clipboard.writeText(url);
    setCopied(idx);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <div className="space-y-1">
      {urls.map((item, i) => (
        <div key={i} className="flex items-center gap-1.5">
          <span className="text-[10px] text-slate-400 w-14 flex-shrink-0">{item.label}</span>
          <span className="text-[10px] text-slate-500 truncate flex-1 font-mono">{item.url}</span>
          <button
            onClick={() => handleCopy(item.url, i)}
            className={`text-[10px] px-1.5 py-0.5 rounded transition-colors flex-shrink-0 ${
              copied === i ? "text-green-400" : "text-slate-400 hover:text-slate-200 bg-slate-800"
            }`}
          >
            {copied === i ? "\u2713" : "Copy"}
          </button>
        </div>
      ))}
    </div>
  );
}
