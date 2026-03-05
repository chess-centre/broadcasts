import { createContext, useContext, useState, useCallback } from "react";

const STORAGE_KEY = "broadcast-settings";

const DEFAULT_SETTINGS = {
  // Board color palette
  boardTheme: "brown",

  // Board display
  showEvalBar: true,
  showLastMove: true,
  animationSpeed: 300,

  // Player info
  showRatings: true,
  showClocks: true,
  showRatingDiff: false,

  // Standings panel
  standingsShowRatings: false,
  standingsShowRecord: false,
  standingsShowPlayed: false,

  // Accent color
  accentColor: "green",
};

function loadSettings() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    }
  } catch {}
  return DEFAULT_SETTINGS;
}

const BroadcastSettingsContext = createContext();

export function BroadcastSettingsProvider({ children }) {
  const [settings, setSettings] = useState(loadSettings);

  const updateSetting = useCallback((key, value) => {
    setSettings((prev) => {
      const next = { ...prev, [key]: value };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }, []);

  return (
    <BroadcastSettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </BroadcastSettingsContext.Provider>
  );
}

export function useBroadcastSettings() {
  const ctx = useContext(BroadcastSettingsContext);
  if (!ctx) throw new Error("useBroadcastSettings must be used within BroadcastSettingsProvider");
  return ctx;
}
