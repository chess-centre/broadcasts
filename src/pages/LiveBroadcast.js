import { useState, useEffect, useCallback } from "react";
import { usePGN, PGNProvider } from "../hooks/usePgn";
import { BroadcastSettingsProvider, useBroadcastSettings } from "../context/BroadcastSettingsContext";
import ChessGame from "../components/Viewer/Game";
import LiveLeaderboard from "../components/Shared/LiveLeaderboard";
import Crosstable from "../components/Shared/Crosstable";
import SettingsPanel from "../components/Broadcast/SettingsPanel";
import SoundManager from "../components/Broadcast/SoundManager";
import GameViewerModal from "../components/Viewer/GameViewerModal";
import useFeaturedBoard from "../hooks/useFeaturedBoard";
import { downloadAllPgn } from "../utils/export";

const ACCENT_MAP = {
  green: "bg-green-400",
  amber: "bg-amber-400",
  blue: "bg-blue-400",
  rose: "bg-rose-400",
  teal: "bg-teal-400",
};

const ROUNDS = [1, 2, 3, 4, 5];

function LiveBroadcastContent() {
  const { games, evals, active, currentRound, subscribeToRound } = usePGN();
  const { settings } = useBroadcastSettings();
  const [sidebarView, setSidebarView] = useState("standings"); // standings | crosstable
  const [showSettings, setShowSettings] = useState(false);
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [fullscreen, setFullscreen] = useState(false);

  const featuredBoard = useFeaturedBoard(games, evals);

  const boardNumbers = Array.from(games.keys()).sort((a, b) => a - b);
  const ongoing = Array.from(games.values()).filter((g) => g.status === "ongoing").length;
  const finished = Array.from(games.values()).filter((g) => g.status === "finished").length;

  const accentDot = ACCENT_MAP[settings.accentColor] || ACCENT_MAP.green;

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    setFullscreen((f) => {
      const next = !f;
      if (next) {
        document.documentElement.requestFullscreen?.();
      } else {
        document.exitFullscreen?.();
      }
      return next;
    });
  }, []);

  // Listen for 'f' key and fullscreen change events
  useEffect(() => {
    const handleKey = (e) => {
      if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
      if (e.key === "f" && !e.ctrlKey && !e.metaKey) {
        toggleFullscreen();
      }
    };
    const handleFsChange = () => {
      if (!document.fullscreenElement) setFullscreen(false);
    };
    window.addEventListener("keydown", handleKey);
    document.addEventListener("fullscreenchange", handleFsChange);
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.removeEventListener("fullscreenchange", handleFsChange);
    };
  }, [toggleFullscreen]);

  // Body class for hiding header in fullscreen
  useEffect(() => {
    if (fullscreen) document.body.classList.add("broadcast-fullscreen");
    else document.body.classList.remove("broadcast-fullscreen");
    return () => document.body.classList.remove("broadcast-fullscreen");
  }, [fullscreen]);

  const showSidebar = sidebarView !== "none";

  return (
    <div className="min-h-screen">
      {/* Stats bar */}
      {!fullscreen && (
        <div className="border-b border-gh-border bg-gh-surface/50">
          <div className="max-w-screen-2xl mx-auto px-6 py-2 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`h-2 w-2 rounded-full ${active ? `${accentDot} animate-pulse` : "bg-red-400"}`} />
              <span className="text-sm text-gh-text">Live Broadcast</span>

              {/* Round selector */}
              <div className="flex items-center gap-1 ml-2">
                <span className="text-[10px] text-gh-textMuted">Rd</span>
                {ROUNDS.map((r) => (
                  <button
                    key={r}
                    onClick={() => subscribeToRound(r)}
                    className={`text-[10px] w-5 h-5 rounded flex items-center justify-center transition-colors ${
                      currentRound === r
                        ? "bg-blue-600 text-white"
                        : "text-slate-500 hover:text-white hover:bg-slate-700"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs text-gh-textMuted">
              {boardNumbers.length > 0 && (
                <>
                  <span><span className="text-gh-text">{boardNumbers.length}</span> boards</span>
                  <span><span className="text-gh-text">{ongoing}</span> live</span>
                  <span><span className="text-gh-text">{finished}</span> done</span>
                  <span className="text-gh-border">|</span>
                </>
              )}

              {/* Sidebar view tabs */}
              <button
                onClick={() => setSidebarView(sidebarView === "standings" ? "none" : "standings")}
                className={`transition-colors ${sidebarView === "standings" ? "text-gh-text" : "text-gh-textMuted hover:text-gh-text"}`}
              >
                Standings
              </button>
              <button
                onClick={() => setSidebarView(sidebarView === "crosstable" ? "none" : "crosstable")}
                className={`transition-colors ${sidebarView === "crosstable" ? "text-gh-text" : "text-gh-textMuted hover:text-gh-text"}`}
              >
                Crosstable
              </button>
              <span className="text-gh-border">|</span>

              {/* Export PGN */}
              <button
                onClick={() => downloadAllPgn(games)}
                className="text-gh-textMuted hover:text-gh-text transition-colors"
                title="Download all PGN"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              </button>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="text-gh-textMuted hover:text-gh-text transition-colors"
                title="Fullscreen (F)"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3.75v4.5m0-4.5h4.5m-4.5 0L9 9M3.75 20.25v-4.5m0 4.5h4.5m-4.5 0L9 15M20.25 3.75h-4.5m4.5 0v4.5m0-4.5L15 9m5.25 11.25h-4.5m4.5 0v-4.5m0 4.5L15 15" />
                </svg>
              </button>

              {/* Settings */}
              <button
                onClick={() => setShowSettings(true)}
                className="text-gh-textMuted hover:text-gh-text transition-colors"
                title="Display settings"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main */}
      <main className={`max-w-screen-2xl mx-auto px-6 ${fullscreen ? "py-4" : "py-6"}`}>
        {boardNumbers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-80 text-center">
            <p className="text-slate-500">
              {active ? "Connected — waiting for board data..." : "Connecting to server..."}
            </p>
          </div>
        ) : (
          <div className={showSidebar ? "grid lg:grid-cols-[220px_1fr] gap-6" : ""}>
            {showSidebar && (
              <div className="lg:sticky lg:top-6 lg:self-start order-first">
                {sidebarView === "standings" && <LiveLeaderboard />}
                {sidebarView === "crosstable" && <Crosstable />}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
              {boardNumbers.map((boardNum) => (
                <ChessGame
                  key={boardNum}
                  round={currentRound}
                  board={boardNum}
                  onClick={() => setSelectedBoard(boardNum)}
                  isFeatured={settings.showFeaturedBoard && featuredBoard === boardNum}
                />
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Fullscreen floating toolbar */}
      {fullscreen && (
        <div className="fixed bottom-4 right-4 flex items-center gap-2 bg-gh-surface/80 border border-gh-border rounded-lg px-3 py-1.5 shadow-lg backdrop-blur-sm z-30">
          <button
            onClick={toggleFullscreen}
            className="text-slate-400 hover:text-white text-xs transition-colors"
          >
            Exit fullscreen
          </button>
          <button
            onClick={() => setShowSettings(true)}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </button>
        </div>
      )}

      {/* Sound Manager */}
      <SoundManager />

      {/* Settings Panel */}
      <SettingsPanel open={showSettings} onClose={() => setShowSettings(false)} />

      {/* Game Viewer Modal */}
      {selectedBoard !== null && (
        <GameViewerModal board={selectedBoard} onClose={() => setSelectedBoard(null)} />
      )}
    </div>
  );
}

export default function LiveBroadcast() {
  return (
    <PGNProvider>
      <BroadcastSettingsProvider>
        <LiveBroadcastContent />
      </BroadcastSettingsProvider>
    </PGNProvider>
  );
}
