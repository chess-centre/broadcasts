import { useState, useEffect, useRef, useCallback } from "react";

const API = process.env.REACT_APP_SERVER_URL || "http://localhost:8080";

function StatusDot({ health }) {
  const colors = {
    healthy: "bg-green-400",
    warning: "bg-amber-400",
    critical: "bg-red-400",
  };
  return (
    <span
      className={`inline-block h-1.5 w-1.5 rounded-full ${colors[health] || "bg-gray-500"} ${
        health === "healthy" ? "animate-pulse" : ""
      }`}
    />
  );
}

function formatElapsed(ms) {
  const sec = Math.round(ms / 1000);
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  return `${min}m ${sec % 60}s ago`;
}

function surname(fullName) {
  if (!fullName) return "---";
  const parts = fullName.trim().split(/\s+/);
  return parts.length > 1 ? parts[parts.length - 1] : fullName;
}

export default function BoardHealthDashboard() {
  const [boards, setBoards] = useState([]);
  const pollRef = useRef(null);

  const fetchHealth = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/status`);
      const data = await res.json();
      setBoards(data.boards || []);
    } catch {
      setBoards([]);
    }
  }, []);

  useEffect(() => {
    fetchHealth();
    pollRef.current = setInterval(fetchHealth, 5000);
    return () => clearInterval(pollRef.current);
  }, [fetchHealth]);

  if (boards.length === 0) {
    return (
      <div className="border border-gh-border rounded bg-gh-surface/30 overflow-hidden">
        <div className="px-3 py-1.5 border-b border-gh-border bg-gh-surface/50">
          <span className="text-[10px] uppercase tracking-wider text-gh-textMuted">Board Health</span>
        </div>
        <div className="px-3 py-2 text-xs text-gh-textMuted">No active boards</div>
      </div>
    );
  }

  return (
    <div className="border border-gh-border rounded bg-gh-surface/30 overflow-hidden">
      <div className="px-3 py-1.5 border-b border-gh-border bg-gh-surface/50 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-gh-textMuted">Board Health</span>
        <span className="text-[10px] text-gh-text">{boards.length}</span>
      </div>
      <div className="divide-y divide-gh-border/30">
        {boards
          .sort((a, b) => a.board - b.board)
          .map((b) => (
            <div key={b.board} className="flex items-center gap-2 px-3 py-1 text-[11px]">
              <StatusDot health={b.health} />
              <span className="text-gh-textMuted w-3 text-right">{b.board}</span>
              <span className="text-gh-text truncate flex-1">
                {surname(b.white)} v {surname(b.black)}
              </span>
              <span
                className={`text-[10px] tabular-nums ${
                  b.health === "critical"
                    ? "text-red-400"
                    : b.health === "warning"
                      ? "text-amber-400"
                      : "text-gh-textMuted"
                }`}
              >
                {formatElapsed(b.elapsed)}
              </span>
              <span className={`text-[10px] ${b.status === "finished" ? "text-gh-textMuted" : "text-gh-text"}`}>
                {b.status === "finished" ? "done" : `mv ${Math.ceil((b.moveCount || 0) / 2)}`}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
}
