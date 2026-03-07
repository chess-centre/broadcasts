import { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { getServerURL } from "../utils/server-url";
import { useWelcomeWizard } from "../components/WelcomeWizard";

const API = getServerURL();

// --- Shared UI ---
function Section({ title, badge, actions, defaultOpen = true, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="rounded-lg border border-gh-border bg-white/[0.02] overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full px-4 py-2.5 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-2">
          <svg className={`w-3 h-3 text-gh-textMuted transition-transform ${open ? "rotate-90" : ""}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
          <span className="text-[10px] uppercase tracking-wider text-gh-textMuted font-medium">{title}</span>
          {badge}
        </div>
        <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
          {actions}
        </div>
      </button>
      {open && <div className="border-t border-gh-border/50">{children}</div>}
    </div>
  );
}

function Row({ label, children, editable }) {
  return (
    <div className={`flex items-center justify-between px-4 py-1.5 text-xs ${editable ? "" : ""}`}>
      <span className="text-gh-textMuted">{label}</span>
      <div className="text-gh-text flex items-center gap-1.5">{children}</div>
    </div>
  );
}

function StatusDot({ on, color = "green" }) {
  const colors = { green: "bg-green-400", red: "bg-red-400", amber: "bg-amber-400", gray: "bg-gray-500" };
  return <span className={`inline-block h-1.5 w-1.5 rounded-full ${colors[color] || colors.gray} ${on ? "animate-pulse" : ""}`} />;
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <button onClick={handleCopy} className={`text-[10px] px-1.5 py-0.5 rounded transition-colors shrink-0 ${copied ? "text-green-400" : "text-gh-textMuted hover:text-gh-text bg-gh-bg"}`}>
      {copied ? "\u2713" : "Copy"}
    </button>
  );
}

// --- Network & Broadcast section ---
function NetworkSection({ config: serverConfig, onConfigChange }) {
  const lanIP = serverConfig?.network?.lanIP || "detecting...";
  const serverURL = serverConfig?.network?.serverURL || "";
  const spectatorURL = serverConfig?.network?.spectatorURL || "";
  const port = serverConfig?.server?.port || 8080;
  const dgtPath = serverConfig?.dgt?.basePath || "";
  const isElectron = window.electronAPI?.isElectron;

  const handleBrowse = async () => {
    if (window.electronAPI?.selectDGTPath) {
      await window.electronAPI.selectDGTPath();
      onConfigChange?.();
    }
  };

  const handleDgtPathChange = async (newPath) => {
    await fetch(`${API}/api/config`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dgtPath: newPath }),
    });
    onConfigChange?.();
  };

  return (
    <Section
      title="Broadcast"
      badge={
        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 ml-2">
          <StatusDot on color="green" />
          {lanIP !== "127.0.0.1" ? "On Network" : "Local Only"}
        </span>
      }
    >
      <div className="divide-y divide-gh-border/30">
        {/* Server address */}
        <Row label="Server">
          <span className="font-mono text-[11px]">{serverURL || `http://localhost:${port}`}</span>
          {serverURL && <CopyButton text={serverURL} />}
        </Row>

        {/* Spectator link */}
        <Row label="Spectator URL">
          <span className="font-mono text-[11px]">{spectatorURL || "--"}</span>
          {spectatorURL && <CopyButton text={spectatorURL} />}
        </Row>

        {/* LAN IP */}
        <Row label="LAN IP">
          <span className="font-mono text-[11px]">{lanIP}</span>
        </Row>

        {/* Port */}
        <Row label="Port">
          <span className="font-mono text-[11px]">{port}</span>
        </Row>

        {/* DGT Path */}
        <div className="px-4 py-2">
          <label className="block text-[10px] uppercase tracking-wider text-gh-textMuted mb-1.5">DGT LiveChess Folder</label>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={dgtPath}
              onChange={(e) => handleDgtPathChange(e.target.value)}
              placeholder="/path/to/DGT/LiveChess/output"
              className="flex-1 bg-gh-bg border border-gh-border text-gh-text font-mono text-xs rounded px-2 py-1.5 focus:border-emerald-500/50 focus:outline-none"
            />
            {isElectron && (
              <button onClick={handleBrowse} className="shrink-0 px-3 py-1.5 text-xs bg-gh-btnDefault border border-gh-btnDefaultBorder rounded hover:bg-gh-surface transition-colors text-gh-text">
                Browse
              </button>
            )}
          </div>
          <p className="text-[10px] text-gh-textMuted/60 mt-1">
            The folder where DGT LiveChess writes PGN files. The server watches this for new moves.
          </p>
        </div>

        {/* Sharing instructions */}
        <div className="px-4 py-3">
          <p className="text-[10px] text-gh-textMuted leading-relaxed">
            <strong className="text-gh-text">Local spectators:</strong> Anyone on the same network can open the Spectator URL in their browser to watch live.
          </p>
          <p className="text-[10px] text-gh-textMuted leading-relaxed mt-1.5">
            <strong className="text-gh-text">Public broadcast:</strong> To share beyond your local network, use the cloud relay or port-forward port {port}.
          </p>
        </div>
      </div>
    </Section>
  );
}

// --- Cloud Relay section ---
function CloudRelaySection({ onRefresh }) {
  const [relayStatus, setRelayStatus] = useState(null);
  const [url, setUrl] = useState("wss://chess-broadcast-relay-wandering-moon-6562.fly.dev");
  const [eventId, setEventId] = useState("");
  const [secret, setSecret] = useState("");
  const [eventName, setEventName] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchStatus = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/relay/status`);
      setRelayStatus(await res.json());
    } catch { setRelayStatus(null); }
  }, []);

  useEffect(() => {
    fetchStatus();
    const id = setInterval(fetchStatus, 3000);
    return () => clearInterval(id);
  }, [fetchStatus]);

  const connected = relayStatus?.status === "connected";
  const connecting = relayStatus?.status === "connecting";

  const handleConnect = async () => {
    setLoading(true);
    try {
      const id = eventId || `event-${Date.now().toString(36)}`;
      const sec = secret || crypto.randomUUID().slice(0, 12);
      setEventId(id);
      setSecret(sec);
      await fetch(`${API}/api/relay/connect`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url, eventId: id, secret: sec, eventName }),
      });
      await fetchStatus();
      onRefresh?.();
    } catch {}
    setLoading(false);
  };

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      await fetch(`${API}/api/relay/disconnect`, { method: "POST" });
      await fetchStatus();
      onRefresh?.();
    } catch {}
    setLoading(false);
  };

  const inputClass = "bg-gh-bg border border-gh-border text-gh-text font-mono text-xs rounded px-2 py-1.5 focus:border-emerald-500/50 focus:outline-none w-full";

  const watchUrl = connected && relayStatus?.eventId && relayStatus?.url
    ? (() => {
        try {
          const u = new URL(relayStatus.url.replace(/^wss:/, "https:").replace(/^ws:/, "http:"));
          return `${u.origin}/watch/${relayStatus.eventId}`;
        } catch { return null; }
      })()
    : null;

  return (
    <Section
      title="Cloud Relay"
      badge={
        <span className={`inline-flex items-center gap-1 text-[10px] ml-2 ${connected ? "text-emerald-400" : connecting ? "text-amber-400" : "text-gh-textMuted"}`}>
          <StatusDot on={connected || connecting} color={connected ? "green" : connecting ? "amber" : "gray"} />
          {connected ? "Broadcasting" : connecting ? "Connecting..." : "Off"}
        </span>
      }
      defaultOpen={!connected}
    >
      <div className="p-4 space-y-3">
        <p className="text-[10px] text-gh-textMuted leading-relaxed">
          Publish your broadcast to the cloud so anyone on the internet can watch. Game data and Stockfish analysis are streamed in real-time.
        </p>

        {!connected && !connecting && (
          <>
            <div className="space-y-2">
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gh-textMuted mb-1">Relay Server</label>
                <input type="text" value={url} onChange={(e) => setUrl(e.target.value)} className={inputClass} placeholder="wss://your-relay.fly.dev" />
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gh-textMuted mb-1">Event ID <span className="normal-case">(auto if blank)</span></label>
                  <input type="text" value={eventId} onChange={(e) => setEventId(e.target.value)} className={inputClass} placeholder="my-tournament-2026" />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-gh-textMuted mb-1">Secret <span className="normal-case">(auto if blank)</span></label>
                  <input type="text" value={secret} onChange={(e) => setSecret(e.target.value)} className={inputClass} placeholder="auto-generated" />
                </div>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider text-gh-textMuted mb-1">Event Name <span className="normal-case">(optional)</span></label>
                <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} className={inputClass} placeholder="London Chess Classic 2026" />
              </div>
            </div>
            {relayStatus?.error && (
              <p className="text-[10px] text-red-400">{relayStatus.error}</p>
            )}
            <button onClick={handleConnect} disabled={loading || !url} className="px-3 py-1.5 text-xs font-medium text-black bg-emerald-400 rounded hover:bg-emerald-300 transition-colors disabled:opacity-50">
              {loading ? "Connecting..." : "Go Live"}
            </button>
          </>
        )}

        {(connected || connecting) && (
          <div className="space-y-2">
            <div className="divide-y divide-gh-border/30 rounded border border-gh-border/50">
              <Row label="Status">
                <StatusDot on={connected} color={connected ? "green" : "amber"} />
                <span className={connected ? "text-emerald-400" : "text-amber-400"}>
                  {connected ? "Live" : "Connecting..."}
                </span>
              </Row>
              <Row label="Event ID">
                <span className="font-mono text-[11px]">{relayStatus?.eventId}</span>
                <CopyButton text={relayStatus?.eventId || ""} />
              </Row>
              {watchUrl && (
                <Row label="Watch URL">
                  <span className="font-mono text-[11px] truncate max-w-[200px]">{`/watch/${relayStatus.eventId}`}</span>
                  <CopyButton text={watchUrl} />
                </Row>
              )}
              <Row label="Relay">
                <span className="font-mono text-[11px] truncate max-w-[200px]">{relayStatus?.url}</span>
              </Row>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={handleDisconnect} disabled={loading} className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-500 transition-colors disabled:opacity-50">
                Stop Broadcasting
              </button>
              <p className="text-[10px] text-gh-textMuted">
                All game updates and engine analysis are being relayed live.
              </p>
            </div>
          </div>
        )}
      </div>
    </Section>
  );
}

// --- Server Status section ---
function ServerStatusSection({ serverStatus }) {
  if (!serverStatus) {
    return (
      <Section title="Server" badge={<span className="ml-2"><StatusDot color="red" /></span>}>
        <div className="px-4 py-3 text-xs text-red-400 flex items-center gap-1.5">
          <StatusDot color="red" /> Offline - is the server running?
        </div>
      </Section>
    );
  }

  return (
    <Section title="Server" badge={<span className="ml-2"><StatusDot on color="green" /></span>} defaultOpen={false}>
      <div className="divide-y divide-gh-border/30">
        <Row label="Clients connected">{serverStatus.connectedClients}</Row>
        <Row label="Active watchers">{serverStatus.activeWatchers}</Row>
        <Row label="Stockfish">
          <StatusDot on={serverStatus.stockfish === "running"} color={serverStatus.stockfish === "running" ? "green" : "red"} />
          <span>{serverStatus.stockfish}</span>
        </Row>
        <Row label="Simulator">
          <StatusDot on={serverStatus.simulator === "running"} color={serverStatus.simulator === "running" ? "green" : "gray"} />
          <span>{serverStatus.simulator}</span>
        </Row>
      </div>
    </Section>
  );
}

// --- Simulator section ---
function SimulatorSection({ serverConfig, onRefresh }) {
  const [boards, setBoards] = useState(4);
  const [speed, setSpeed] = useState("2");
  const [round, setRound] = useState(1);
  const [eventName, setEventName] = useState("Live Broadcast");
  const [simStatus, setSimStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchSim = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/simulator/status`);
      setSimStatus(await res.json());
    } catch { setSimStatus(null); }
  }, []);

  useEffect(() => {
    fetchSim();
    const id = setInterval(fetchSim, 3000);
    return () => clearInterval(id);
  }, [fetchSim]);

  const running = simStatus?.running;
  const games = simStatus?.games || [];
  const finished = games.filter((g) => g.status === "finished").length;
  const ongoing = games.filter((g) => g.status === "ongoing").length;

  const handleStart = async () => {
    setLoading(true);
    try {
      await fetch(`${API}/api/simulator/start`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ boards, speed, round, eventName }),
      });
      await fetchSim();
      onRefresh?.();
    } catch {}
    setLoading(false);
  };

  const handleStop = async () => {
    setLoading(true);
    try {
      await fetch(`${API}/api/simulator/stop`, { method: "POST" });
      await fetchSim();
      onRefresh?.();
    } catch {}
    setLoading(false);
  };

  const inputClass = "bg-gh-bg border border-gh-border text-gh-text font-mono text-xs rounded px-2 py-1 disabled:opacity-40 focus:border-gh-btnDefaultBorder focus:outline-none w-full";

  return (
    <Section
      title="Simulator"
      badge={running ? (
        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 ml-2">
          <StatusDot on color="green" /> {ongoing} live &middot; {finished} done
        </span>
      ) : null}
      defaultOpen={false}
    >
      <div className="p-4 space-y-3">
        <p className="text-[10px] text-gh-textMuted leading-relaxed">
          No DGT boards? Simulate games with famous historical matches to test the system.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-gh-textMuted mb-1">Boards</label>
            <select value={boards} onChange={(e) => setBoards(Number(e.target.value))} disabled={running} className={inputClass}>
              {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>{n}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-gh-textMuted mb-1">Speed</label>
            <select value={speed} onChange={(e) => setSpeed(e.target.value)} disabled={running} className={inputClass}>
              <option value="1">Fast</option>
              <option value="2">Normal</option>
              <option value="3">Slow</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-gh-textMuted mb-1">Round</label>
            <input type="number" min={1} max={20} value={round} onChange={(e) => setRound(Math.max(1, parseInt(e.target.value) || 1))} disabled={running} className={inputClass} />
          </div>
          <div>
            <label className="block text-[10px] uppercase tracking-wider text-gh-textMuted mb-1">Event</label>
            <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} disabled={running} placeholder="Event name" className={inputClass} />
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!running ? (
            <button onClick={handleStart} disabled={loading} className="px-3 py-1.5 text-xs font-medium text-black bg-emerald-400 rounded hover:bg-emerald-300 transition-colors disabled:opacity-50">
              Start Simulator
            </button>
          ) : (
            <button onClick={handleStop} disabled={loading} className="px-3 py-1.5 text-xs font-medium text-white bg-red-600 rounded hover:bg-red-500 transition-colors disabled:opacity-50">
              Stop
            </button>
          )}
        </div>
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
                    <div className={`h-full rounded-full transition-all ${g.status === "finished" ? "bg-gh-textMuted" : "bg-emerald-400"}`} style={{ width: `${pct}%` }} />
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
    </Section>
  );
}

// --- OBS Integration section ---
function OBSSection({ serverConfig }) {
  const [copied, setCopied] = useState(null);
  const base = serverConfig?.network?.serverURL || "http://localhost:8080";

  const widgets = [
    { id: "board", label: "Board 1", url: `${base}/obs?type=board&board=1&round=1`, desc: "Single board with eval bar" },
    { id: "board2", label: "Board 2", url: `${base}/obs?type=board&board=2&round=1`, desc: "Second board widget" },
    { id: "featured", label: "Featured", url: `${base}/obs?type=featured&round=1`, desc: "Auto-selected best game" },
    { id: "standings", label: "Standings", url: `${base}/obs?type=standings&round=1`, desc: "Live tournament table" },
    { id: "ticker", label: "Ticker", url: `${base}/obs?type=ticker&round=1`, desc: "Scrolling results bar" },
  ];

  const handleCopy = async (url, id) => {
    await navigator.clipboard.writeText(url);
    setCopied(id);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <Section
      title="OBS Integration"
      badge={<span className="text-[10px] text-gh-textMuted ml-2">{widgets.length} widgets</span>}
      defaultOpen={false}
    >
      <div className="divide-y divide-gh-border/30">
        <div className="px-4 py-2.5">
          <p className="text-[10px] text-gh-textMuted leading-relaxed">
            Add these as <strong className="text-gh-text">Browser Sources</strong> in OBS. Background is transparent. Set width/height to match your scene layout.
          </p>
        </div>
        {widgets.map((w) => (
          <div key={w.id} className="px-4 py-2 flex items-center gap-2 group">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-medium text-gh-text">{w.label}</span>
                <span className="text-[9px] text-gh-textMuted">{w.desc}</span>
              </div>
              <p className="text-[10px] font-mono text-gh-textMuted/70 truncate mt-0.5">{w.url}</p>
            </div>
            <button
              onClick={() => handleCopy(w.url, w.id)}
              className={`text-[10px] px-2 py-1 rounded transition-colors shrink-0 ${
                copied === w.id ? "text-green-400 bg-green-500/10" : "text-gh-textMuted hover:text-gh-text bg-gh-bg"
              }`}
            >
              {copied === w.id ? "\u2713 Copied" : "Copy URL"}
            </button>
          </div>
        ))}
        <div className="px-4 py-2.5">
          <p className="text-[10px] text-gh-textMuted leading-relaxed">
            <strong className="text-gh-text">Tip:</strong> Change <code className="text-emerald-400/80">board=1</code> to any board number,
            and <code className="text-emerald-400/80">round=1</code> to the current round.
            Add <code className="text-emerald-400/80">&amp;bg=#000</code> for a solid background.
          </p>
        </div>
      </div>
    </Section>
  );
}

// --- Board Health section ---
function BoardHealthSection() {
  const [boards, setBoards] = useState([]);
  const pollRef = useRef(null);

  const fetchHealth = useCallback(async () => {
    try {
      const res = await fetch(`${API}/api/status`);
      const data = await res.json();
      setBoards(data.boards || []);
    } catch { setBoards([]); }
  }, []);

  useEffect(() => {
    fetchHealth();
    pollRef.current = setInterval(fetchHealth, 5000);
    return () => clearInterval(pollRef.current);
  }, [fetchHealth]);

  if (boards.length === 0) return null;

  const formatElapsed = (ms) => {
    const sec = Math.round(ms / 1000);
    if (sec < 60) return `${sec}s ago`;
    return `${Math.floor(sec / 60)}m ${sec % 60}s ago`;
  };
  const surname = (n) => { if (!n) return "---"; const p = n.trim().split(/\s+/); return p.length > 1 ? p[p.length - 1] : n; };

  return (
    <Section title="Active Boards" badge={<span className="text-[10px] text-gh-text ml-2">{boards.length}</span>} defaultOpen={false}>
      <div className="divide-y divide-gh-border/30">
        {boards.sort((a, b) => a.board - b.board).map((b) => (
          <div key={b.board} className="flex items-center gap-2 px-4 py-1.5 text-[11px]">
            <StatusDot on={b.health === "healthy"} color={b.health === "critical" ? "red" : b.health === "warning" ? "amber" : "green"} />
            <span className="text-gh-textMuted w-3 text-right">{b.board}</span>
            <span className="text-gh-text truncate flex-1">{surname(b.white)} v {surname(b.black)}</span>
            <span className={`text-[10px] tabular-nums ${b.health === "critical" ? "text-red-400" : b.health === "warning" ? "text-amber-400" : "text-gh-textMuted"}`}>
              {formatElapsed(b.elapsed)}
            </span>
            <span className={`text-[10px] ${b.status === "finished" ? "text-gh-textMuted" : "text-gh-text"}`}>
              {b.status === "finished" ? "done" : `mv ${Math.ceil((b.moveCount || 0) / 2)}`}
            </span>
          </div>
        ))}
      </div>
    </Section>
  );
}

// --- Tournament summary ---
function TournamentSection({ tournament, onDelete }) {
  const navigate = useNavigate();

  if (!tournament) {
    return (
      <button
        onClick={() => navigate("/tournament")}
        className="w-full rounded-lg border border-dashed border-gh-border bg-white/[0.01] py-4 text-xs text-gh-textMuted hover:text-gh-text hover:border-slate-500 transition-colors flex items-center justify-center gap-2"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Set up tournament
      </button>
    );
  }

  return (
    <Section
      title="Tournament"
      badge={<span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 ml-2"><span className="w-1 h-1 bg-emerald-400 rounded-full" /> Active</span>}
      actions={
        <button onClick={() => navigate("/tournament")} className="text-[10px] text-emerald-400 hover:text-emerald-300 transition-colors font-medium">
          Manage
        </button>
      }
    >
      <div className="divide-y divide-gh-border/30">
        <Row label="Event">{tournament.event}</Row>
        <Row label="Format"><span className="capitalize">{tournament.format?.replace("-", " ")}</span></Row>
        <Row label="Players">{tournament.players?.length}</Row>
        <Row label="Rounds">{tournament.rounds}</Row>
      </div>
      <div className="px-4 py-2 flex items-center gap-3 border-t border-gh-border/30">
        <button onClick={() => { onDelete(); navigate("/tournament"); }} className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors">
          New Tournament
        </button>
        <button onClick={onDelete} className="text-[10px] text-red-400 hover:text-red-300 transition-colors">
          Clear
        </button>
      </div>
    </Section>
  );
}

// --- Main ---
export default function Home() {
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [serverConfig, setServerConfig] = useState(null);
  const [serverStatus, setServerStatus] = useState(null);
  const { reset: resetWelcome } = useWelcomeWizard();

  const fetchAll = useCallback(async () => {
    try {
      const [configRes, statusRes, tournamentRes] = await Promise.all([
        fetch(`${API}/api/config`),
        fetch(`${API}/api/status`),
        fetch(`${API}/api/tournament`),
      ]);
      setServerConfig(await configRes.json());
      setServerStatus(await statusRes.json());
      const t = await tournamentRes.json();
      if (t) setTournament(t);
    } catch {}
  }, []);

  useEffect(() => {
    fetchAll();
    const id = setInterval(fetchAll, 5000);
    return () => clearInterval(id);
  }, [fetchAll]);

  const handleDelete = async () => {
    await fetch(`${API}/api/tournament`, { method: "DELETE" });
    setTournament(null);
  };

  const handleShowGuide = () => {
    resetWelcome();
    window.location.reload();
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 font-mono">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xs text-gh-textMuted uppercase tracking-wider">Dashboard</h1>
        <div className="flex items-center gap-3">
          <button onClick={handleShowGuide} className="text-[10px] text-gh-textMuted hover:text-gh-text transition-colors" title="Re-run the setup guide">
            Setup Guide
          </button>
          <button
            onClick={() => navigate("/live")}
            className="inline-flex items-center gap-1.5 text-[10px] font-medium text-emerald-400 bg-emerald-500/[0.08] border border-emerald-500/20 rounded px-2.5 py-1 hover:bg-emerald-500/[0.15] transition-colors"
          >
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Open Live View
          </button>
        </div>
      </div>

      <div className="space-y-3">
        <NetworkSection config={serverConfig} onConfigChange={fetchAll} />
        <CloudRelaySection onRefresh={fetchAll} />
        <OBSSection serverConfig={serverConfig} />
        <ServerStatusSection serverStatus={serverStatus} />
        <BoardHealthSection />
        <SimulatorSection serverConfig={serverConfig} onRefresh={fetchAll} />
        <TournamentSection tournament={tournament} onDelete={handleDelete} />
      </div>
    </div>
  );
}
