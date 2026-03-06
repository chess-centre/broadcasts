import { useState, useEffect, useRef, useCallback } from "react";
import { getServerURL } from "../utils/server-url";

const API = getServerURL();

function StatusDot({ active, color }) {
  const colors = {
    green: "bg-green-400",
    red: "bg-red-400",
    amber: "bg-amber-400",
    gray: "bg-gray-500",
  };
  return (
    <span
      className={`inline-block h-1.5 w-1.5 rounded-full ${colors[color] || colors.gray} ${active ? "animate-pulse" : ""}`}
    />
  );
}

function SectionHeader({ children }) {
  return (
    <div className="px-3 py-1.5 border-b border-gh-border bg-gh-surface/50">
      <span className="text-[10px] uppercase tracking-wider text-gh-textMuted">{children}</span>
    </div>
  );
}

function ConfigRow({ label, value, status }) {
  return (
    <div className="flex items-center justify-between px-3 py-1 text-xs">
      <span className="text-gh-textMuted">{label}</span>
      <span className="text-gh-text flex items-center gap-1.5">
        {status && <StatusDot active={status === "running"} color={status === "running" ? "green" : status === "stopped" ? "red" : "gray"} />}
        {value}
      </span>
    </div>
  );
}

export default function ConfigDashboard() {
  const [boards, setBoards] = useState(4);
  const [speed, setSpeed] = useState("2");
  const [round, setRound] = useState(1);
  const [eventName, setEventName] = useState("Live Broadcast");
  const [simStatus, setSimStatus] = useState(null);
  const [serverConfig, setServerConfig] = useState(null);
  const [serverStatus, setServerStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const pollRef = useRef(null);

  const fetchAll = useCallback(async () => {
    try {
      const [simRes, configRes, statusRes] = await Promise.all([
        fetch(`${API}/api/simulator/status`),
        fetch(`${API}/api/config`),
        fetch(`${API}/api/status`),
      ]);
      setSimStatus(await simRes.json());
      setServerConfig(await configRes.json());
      setServerStatus(await statusRes.json());
    } catch {
      setSimStatus(null);
      setServerConfig(null);
      setServerStatus(null);
    }
  }, []);

  useEffect(() => {
    fetchAll();
    pollRef.current = setInterval(fetchAll, 3000);
    return () => clearInterval(pollRef.current);
  }, [fetchAll]);

  const handleStart = async () => {
    setLoading(true);
    try {
      await fetch(`${API}/api/simulator/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ boards, speed, round, eventName }),
      });
      await fetchAll();
    } catch (err) {
      console.error("Start failed:", err);
    }
    setLoading(false);
  };

  const handleStop = async () => {
    setLoading(true);
    try {
      await fetch(`${API}/api/simulator/stop`, { method: "POST" });
      await fetchAll();
    } catch (err) {
      console.error("Stop failed:", err);
    }
    setLoading(false);
  };

  const running = simStatus?.running;
  const games = simStatus?.games || [];
  const finished = games.filter((g) => g.status === "finished").length;
  const ongoing = games.filter((g) => g.status === "ongoing").length;

  const inputClass =
    "bg-gh-bg border border-gh-border text-gh-text font-mono text-xs rounded px-2 py-1 disabled:opacity-40 focus:border-gh-btnDefaultBorder focus:outline-none";

  return (
    <div className="space-y-3">
      {/* Server Status */}
      <div className="border border-gh-border rounded bg-gh-surface/30 overflow-hidden">
        <SectionHeader>Server</SectionHeader>
        {serverConfig && serverStatus ? (
          <div className="divide-y divide-gh-border/50">
            <ConfigRow label="port" value={serverConfig.server.port} />
            <ConfigRow label="clients" value={serverStatus.connectedClients} />
            <ConfigRow label="watchers" value={serverStatus.activeWatchers} />
            <ConfigRow label="stockfish" value={serverStatus.stockfish} status={serverStatus.stockfish} />
            <ConfigRow label="simulator" value={serverStatus.simulator} status={serverStatus.simulator} />
          </div>
        ) : (
          <div className="px-3 py-2 text-xs text-red-400 flex items-center gap-1.5">
            <StatusDot color="red" /> offline
          </div>
        )}
      </div>

      {/* Simulator Controls */}
      <div className="border border-gh-border rounded bg-gh-surface/30 overflow-hidden">
        <SectionHeader>
          <span className="flex items-center gap-1.5">
            Simulator
            <StatusDot active={running} color={running ? "green" : "gray"} />
          </span>
        </SectionHeader>
        <div className="p-3 space-y-3">
          {/* Config fields */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gh-textMuted mb-1">Boards</label>
              <select value={boards} onChange={(e) => setBoards(Number(e.target.value))} disabled={running} className={inputClass + " w-full"}>
                {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gh-textMuted mb-1">Speed</label>
              <select value={speed} onChange={(e) => setSpeed(e.target.value)} disabled={running} className={inputClass + " w-full"}>
                <option value="1">fast (1-10s)</option>
                <option value="2">normal (8-25s)</option>
                <option value="3">slow (20-60s)</option>
              </select>
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gh-textMuted mb-1">Round</label>
              <input
                type="number"
                min={1}
                max={20}
                value={round}
                onChange={(e) => setRound(Math.max(1, parseInt(e.target.value) || 1))}
                disabled={running}
                className={inputClass + " w-full"}
              />
            </div>
            <div>
              <label className="block text-[10px] uppercase tracking-wider text-gh-textMuted mb-1">Event</label>
              <input
                type="text"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
                disabled={running}
                placeholder="Event name"
                className={inputClass + " w-full"}
              />
            </div>
          </div>

          {/* Start / Stop */}
          <div className="flex items-center gap-2">
            {!running ? (
              <button
                onClick={handleStart}
                disabled={loading}
                className="px-3 py-1 text-xs font-medium text-black bg-green-400 rounded hover:bg-green-300 transition-colors disabled:opacity-50"
              >
                start
              </button>
            ) : (
              <button
                onClick={handleStop}
                disabled={loading}
                className="px-3 py-1 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-500 transition-colors disabled:opacity-50"
              >
                stop
              </button>
            )}
            {running && (
              <span className="text-[10px] text-gh-textMuted">
                {ongoing} live &middot; {finished} done
              </span>
            )}
          </div>

          {/* Game progress */}
          {games.length > 0 && (
            <div className="space-y-0.5">
              {games.map((g) => {
                const pct = g.totalMoves > 0 ? Math.round((g.moves / g.totalMoves) * 100) : 0;
                return (
                  <div key={g.board} className="flex items-center gap-2 text-[11px]">
                    <span className="text-gh-textMuted w-3 text-right">{g.board}</span>
                    <span className="text-gh-text truncate w-20">{g.white.split(" ").pop()}</span>
                    <span className="text-gh-textMuted text-[10px]">v</span>
                    <span className="text-gh-text truncate w-20">{g.black.split(" ").pop()}</span>
                    <div className="flex-1 bg-gh-bg rounded-full h-1 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${g.status === "finished" ? "bg-gh-textMuted" : "bg-green-400"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className={`w-10 text-right text-[10px] ${g.status === "finished" ? "text-gh-textMuted" : "text-gh-text"}`}>
                      {g.status === "finished" ? g.result : `${g.moves}/${g.totalMoves}`}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Broadcast / DGT Config */}
      <div className="border border-gh-border rounded bg-gh-surface/30 overflow-hidden">
        <SectionHeader>Broadcast</SectionHeader>
        {serverConfig ? (
          <div className="divide-y divide-gh-border/50">
            <ConfigRow label="max boards" value={serverConfig.broadcast.maxBoards} />
            <ConfigRow label="poll interval" value={`${serverConfig.broadcast.pollInterval}ms`} />
            <ConfigRow label="debug" value={serverConfig.broadcast.debug ? "on" : "off"} />
            <ConfigRow label="dgt path" value={serverConfig.dgt.basePath} />
            <ConfigRow label="watch mode" value={serverConfig.dgt.watchMode} />
            <ConfigRow label="livechess api" value={serverConfig.dgt.liveChessApiUrl} />
          </div>
        ) : (
          <div className="px-3 py-2 text-xs text-gh-textMuted">—</div>
        )}
      </div>
    </div>
  );
}
