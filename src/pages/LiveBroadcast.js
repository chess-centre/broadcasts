import { useState } from "react";
import { usePGN, PGNProvider } from "../hooks/usePgn";
import ChessGame from "../components/Viewer/Game";
import LiveLeaderboard from "../components/Shared/LiveLeaderboard";

function LiveBroadcastContent() {
  const { games, active } = usePGN();
  const [showLeaderboard, setShowLeaderboard] = useState(true);

  const boardNumbers = Array.from(games.keys()).sort((a, b) => a - b);
  const ongoing = Array.from(games.values()).filter((g) => g.status === "ongoing").length;
  const finished = Array.from(games.values()).filter((g) => g.status === "finished").length;

  return (
    <div className="min-h-screen">
      {/* Stats bar */}
      <div className="border-b border-gh-border bg-gh-surface/50">
        <div className="max-w-screen-2xl mx-auto px-6 py-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`h-2 w-2 rounded-full ${active ? "bg-green-400 animate-pulse" : "bg-red-400"}`} />
            <span className="text-sm text-gh-text">Live Broadcast</span>
          </div>

          <div className="flex items-center gap-4 text-xs text-gh-textMuted">
            {boardNumbers.length > 0 && (
              <>
                <span><span className="text-gh-text">{boardNumbers.length}</span> boards</span>
                <span><span className="text-gh-text">{ongoing}</span> live</span>
                <span><span className="text-gh-text">{finished}</span> done</span>
                <span className="text-gh-border">|</span>
              </>
            )}
            <button
              onClick={() => setShowLeaderboard(!showLeaderboard)}
              className="text-gh-textMuted hover:text-gh-text transition-colors"
            >
              {showLeaderboard ? "Hide standings" : "Show standings"}
            </button>
          </div>
        </div>
      </div>

      {/* Main */}
      <main className="max-w-screen-2xl mx-auto px-6 py-6">
        {boardNumbers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-80 text-center">
            <p className="text-slate-500">
              {active ? "Connected — waiting for board data..." : "Connecting to server..."}
            </p>
          </div>
        ) : (
          <div className={showLeaderboard ? "grid lg:grid-cols-[220px_1fr] gap-6" : ""}>
            {/* Leaderboard — left side */}
            {showLeaderboard && (
              <div className="lg:sticky lg:top-6 lg:self-start order-first">
                <LiveLeaderboard />
              </div>
            )}

            {/* Boards grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
              {boardNumbers.map((boardNum) => (
                <ChessGame key={boardNum} round={1} board={boardNum} />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function LiveBroadcast() {
  return (
    <PGNProvider>
      <LiveBroadcastContent />
    </PGNProvider>
  );
}
