// Shared UI components for chess broadcast apps.
// Components will be migrated from the legacy src/components/ directory.
//
// Planned exports:
// - Board, EvalBar, WinProbability, PlayerAvatar
// - MoveList, MoveTimeChart, GameViewerModal
// - LiveLeaderboard, Crosstable, Standings
// - SettingsToggle, QROverlay
// - BroadcastSettingsContext + useBroadcastSettings
//
// For now, re-export hooks and utilities that are framework-agnostic.

export { useInterval } from "./hooks/use-interval";
export { useClockCountdown } from "./hooks/use-clock-countdown";
export { useAutoCycle } from "./hooks/use-auto-cycle";
export { useFeaturedBoard } from "./hooks/use-featured-board";
