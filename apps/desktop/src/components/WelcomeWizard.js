import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Logo } from "./Logo";
import { getServerURL } from "../utils/server-url";

const API = getServerURL();

const STEPS = [
  { id: "welcome", title: "Welcome to Chess Broadcast", subtitle: "Professional live broadcasting for chess tournaments" },
  { id: "how", title: "How It Works", subtitle: "Understand the broadcast pipeline" },
  { id: "dgt", title: "Connect Your Boards", subtitle: "Point to your DGT LiveChess output folder" },
  { id: "tournament", title: "Tournament Setup", subtitle: "Create a tournament or broadcast individual games" },
  { id: "broadcast", title: "Going Live", subtitle: "Share your broadcast with local spectators" },
  { id: "cloud", title: "Cloud Broadcasting", subtitle: "Reach spectators anywhere in the world" },
  { id: "obs", title: "OBS / Streaming", subtitle: "Overlay widgets for your live stream" },
  { id: "ready", title: "You're All Set!", subtitle: "Start broadcasting your chess event" },
];

// --- Animated pipeline diagram ---
function PipelineDiagram() {
  const [activeStep, setActiveStep] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setActiveStep((s) => (s + 1) % 5), 1800);
    return () => clearInterval(timerRef.current);
  }, []);

  const steps = [
    { icon: BoardsIcon, label: "DGT Board", desc: "Moves played" },
    { icon: FileIcon, label: "PGN Files", desc: "Written to disk" },
    { icon: ServerIcon, label: "Broadcast Server", desc: "Parses & streams" },
    { icon: EngineIcon, label: "Stockfish", desc: "Analyses positions" },
    { icon: ScreenIcon, label: "Spectators", desc: "Watch live" },
  ];

  return (
    <div className="flex items-center justify-center gap-1 py-2">
      {steps.map((step, i) => (
        <div key={i} className="flex items-center">
          <div className={`flex flex-col items-center transition-all duration-500 ${i <= activeStep ? "opacity-100 scale-100" : "opacity-30 scale-95"}`}>
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors duration-500 ${i === activeStep ? "bg-emerald-500/20 border-emerald-500/50" : "bg-white/[0.03] border-gh-border/50"} border`}>
              <step.icon className={`w-5 h-5 transition-colors duration-500 ${i === activeStep ? "text-emerald-400" : "text-gh-textMuted"}`} />
            </div>
            <p className="text-[8px] text-gh-textMuted mt-1 text-center w-14 leading-tight">{step.label}</p>
            <p className={`text-[7px] text-center w-14 leading-tight transition-colors duration-500 ${i === activeStep ? "text-emerald-400" : "text-gh-textMuted/50"}`}>{step.desc}</p>
          </div>
          {i < steps.length - 1 && (
            <div className="flex items-center px-0.5 -mt-5">
              <div className={`h-px w-4 transition-colors duration-500 ${i < activeStep ? "bg-emerald-400" : "bg-gh-border/50"}`} />
              <svg className={`w-2 h-2 transition-colors duration-500 ${i < activeStep ? "text-emerald-400" : "text-gh-border/50"}`} viewBox="0 0 8 8" fill="currentColor">
                <path d="M2 0l4 4-4 4z" />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// --- Animated cloud relay diagram ---
function CloudDiagram() {
  const [pulse, setPulse] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setPulse((p) => (p + 1) % 4), 1200);
    return () => clearInterval(id);
  }, []);

  const boxes = [
    { label: "Your Laptop", sub: "Desktop App", color: "emerald", icon: LaptopIcon },
    { label: "Cloud Relay", sub: "Fly.io", color: "blue", icon: CloudIcon },
    { label: "Web Viewers", sub: "Any browser", color: "amber", icon: GlobeIcon },
  ];

  return (
    <div className="flex items-center justify-center gap-2 py-3">
      {boxes.map((box, i) => (
        <div key={i} className="flex items-center">
          <div className={`flex flex-col items-center p-3 rounded-lg border transition-all duration-500 ${
            pulse >= i ? `bg-${box.color}-500/[0.08] border-${box.color}-500/30` : "bg-white/[0.02] border-gh-border/30"
          }`} style={{ minWidth: 100 }}>
            <box.icon className={`w-6 h-6 mb-1.5 transition-colors duration-500 ${pulse >= i ? getColorClass(box.color) : "text-gh-textMuted"}`} />
            <p className="text-[10px] font-medium text-gh-text">{box.label}</p>
            <p className="text-[8px] text-gh-textMuted">{box.sub}</p>
          </div>
          {i < boxes.length - 1 && (
            <div className="flex items-center px-1">
              {[0, 1, 2].map((d) => (
                <div
                  key={d}
                  className={`w-1.5 h-1.5 rounded-full mx-0.5 transition-all duration-300 ${
                    pulse > i ? "bg-emerald-400 scale-100" : "bg-gh-border scale-75"
                  }`}
                  style={{ transitionDelay: `${d * 150}ms` }}
                />
              ))}
              <svg className={`w-2.5 h-2.5 transition-colors duration-500 ${pulse > i ? "text-emerald-400" : "text-gh-border"}`} viewBox="0 0 8 8" fill="currentColor">
                <path d="M2 0l4 4-4 4z" />
              </svg>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

function getColorClass(color) {
  const map = { emerald: "text-emerald-400", blue: "text-blue-400", amber: "text-amber-400" };
  return map[color] || "text-gh-textMuted";
}

// --- OBS Preview ---
function OBSPreview() {
  const [activeTab, setActiveTab] = useState("board");
  const tabs = [
    { id: "board", label: "Single Board" },
    { id: "featured", label: "Featured" },
    { id: "standings", label: "Standings" },
    { id: "ticker", label: "Ticker" },
  ];

  const descriptions = {
    board: { url: "/obs?type=board&board=1&round=1", desc: "Shows a single board with eval bar, clocks, and player info. Use one per board you want to display." },
    featured: { url: "/obs?type=featured&round=1", desc: "Automatically shows the most interesting board based on evaluation swings and game state." },
    standings: { url: "/obs?type=standings&round=1", desc: "Live tournament standings table. Updates as results come in." },
    ticker: { url: "/obs?type=ticker&round=1", desc: "Scrolling results ticker bar. Perfect for the bottom of your stream." },
  };

  const active = descriptions[activeTab];

  return (
    <div className="space-y-3">
      {/* Tab bar */}
      <div className="flex gap-1 bg-gh-bg rounded-lg p-0.5">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-1.5 text-[10px] rounded-md transition-all ${
              activeTab === tab.id
                ? "bg-white/[0.08] text-emerald-400 font-medium"
                : "text-gh-textMuted hover:text-gh-text"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Preview */}
      <div className="rounded-lg border border-gh-border/50 bg-gh-bg overflow-hidden">
        {/* OBS mockup title bar */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white/[0.02] border-b border-gh-border/30">
          <div className="w-2 h-2 rounded-full bg-red-500/60" />
          <div className="w-2 h-2 rounded-full bg-amber-500/60" />
          <div className="w-2 h-2 rounded-full bg-green-500/60" />
          <span className="text-[9px] text-gh-textMuted ml-2">OBS Browser Source</span>
        </div>

        {/* Content area */}
        <div className="p-4 min-h-[80px]">
          {activeTab === "board" && (
            <div className="flex items-center gap-3">
              <div className="w-16 h-16 rounded bg-white/[0.05] grid grid-cols-4 grid-rows-4 overflow-hidden shrink-0">
                {Array.from({ length: 16 }).map((_, i) => {
                  const r = Math.floor(i / 4);
                  const c = i % 4;
                  return <div key={i} className={(r + c) % 2 === 0 ? "bg-amber-200/30" : "bg-amber-800/30"} />;
                })}
              </div>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5">
                  <div className="w-8 h-1.5 bg-white/20 rounded" />
                  <div className="w-12 h-1.5 bg-white/10 rounded" />
                </div>
                <div className="w-full h-1 bg-emerald-500/30 rounded" />
                <div className="flex items-center gap-1.5">
                  <div className="w-10 h-1.5 bg-white/20 rounded" />
                  <div className="w-8 h-1.5 bg-white/10 rounded" />
                </div>
              </div>
            </div>
          )}
          {activeTab === "featured" && (
            <div className="flex items-center gap-2">
              <div className="px-2 py-1 bg-amber-500/10 border border-amber-500/20 rounded text-[9px] text-amber-400 animate-pulse">FEATURED</div>
              <span className="text-[10px] text-gh-textMuted">Auto-selects the most exciting game</span>
            </div>
          )}
          {activeTab === "standings" && (
            <div className="space-y-1">
              {["Carlsen 3.5/4", "Caruana 3.0/4", "Ding 2.5/4"].map((p, i) => (
                <div key={i} className="flex items-center gap-2 text-[9px]">
                  <span className="text-gh-textMuted w-3">{i + 1}.</span>
                  <div className="h-1.5 bg-white/10 rounded flex-1" style={{ maxWidth: `${100 - i * 20}%` }} />
                  <span className="text-gh-textMuted">{p}</span>
                </div>
              ))}
            </div>
          )}
          {activeTab === "ticker" && (
            <div className="overflow-hidden">
              <div className="flex items-center gap-4 animate-marquee text-[9px] text-gh-textMuted whitespace-nowrap">
                <span>Carlsen 1-0 Caruana (Rd 3)</span>
                <span className="text-gh-border">|</span>
                <span>Ding 1/2-1/2 Nepomniachtchi (Rd 3)</span>
                <span className="text-gh-border">|</span>
                <span>Firouzja 0-1 Gukesh (Rd 3)</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* URL + instructions */}
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <code className="flex-1 text-[10px] font-mono text-emerald-400/80 bg-gh-bg px-2 py-1 rounded border border-gh-border/30 truncate">
            {`http://<your-ip>:8080${active.url}`}
          </code>
        </div>
        <p className="text-[10px] text-gh-textMuted leading-relaxed">{active.desc}</p>
      </div>
    </div>
  );
}

// --- Step Content Components ---

function StepWelcome() {
  return (
    <div className="text-center space-y-6">
      <div className="flex justify-center">
        <div className="relative">
          <div className="absolute inset-0 bg-emerald-500/20 rounded-3xl blur-xl animate-pulse" />
          <div className="relative">
            <Logo size={80} />
          </div>
        </div>
      </div>
      <div className="space-y-3 max-w-md mx-auto">
        <p className="text-sm text-gh-text leading-relaxed">
          Chess Broadcast connects DGT electronic boards to spectators worldwide.
          This guide walks you through everything you need to get broadcasting.
        </p>
        <div className="grid grid-cols-3 gap-3 pt-4">
          {[
            { icon: BoardsIcon, label: "Multi-board", desc: "Up to 20 boards" },
            { icon: EngineIcon, label: "Stockfish 16", desc: "Built-in analysis" },
            { icon: GlobeIcon, label: "Cloud relay", desc: "Public broadcasts" },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="rounded-lg border border-gh-border/50 bg-white/[0.02] p-3 text-center group hover:border-emerald-500/30 transition-colors">
              <Icon className="w-5 h-5 text-emerald-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
              <p className="text-[10px] font-medium text-gh-text">{label}</p>
              <p className="text-[10px] text-gh-textMuted">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepHowItWorks() {
  return (
    <div className="space-y-4 max-w-md mx-auto">
      <PipelineDiagram />

      <div className="space-y-2">
        {[
          { num: "1", color: "emerald", title: "DGT boards detect moves", desc: "DGT LiveChess software reads electronic boards and writes PGN files to a folder on your computer." },
          { num: "2", color: "blue", title: "Server watches for changes", desc: "Chess Broadcast monitors the PGN folder in real-time. Every new move is instantly parsed and streamed." },
          { num: "3", color: "purple", title: "Stockfish analyses each position", desc: "The built-in engine evaluates every position, providing eval bars, accuracy, and best move arrows." },
          { num: "4", color: "amber", title: "Spectators see moves live", desc: "Viewers connect via browser (local network or cloud relay) and see boards, clocks, and analysis in real-time." },
        ].map(({ num, color, title, desc }) => (
          <div key={num} className="flex gap-3 items-start p-2.5 rounded-lg border border-gh-border/30 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
            <span className={`flex items-center justify-center w-6 h-6 rounded-md bg-${color}-500/[0.1] border border-${color}-500/20 text-${color}-400 text-[10px] font-bold shrink-0`}>
              {num}
            </span>
            <div>
              <p className="text-[11px] text-gh-text font-medium">{title}</p>
              <p className="text-[10px] text-gh-textMuted leading-relaxed mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StepDGT({ config, onPathSelect }) {
  const currentPath = config?.dgt?.basePath || "";
  const isElectron = window.electronAPI?.isElectron;

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div className="rounded-lg border border-gh-border/50 bg-white/[0.02] p-4 space-y-4">
        <div>
          <h4 className="text-xs font-semibold text-gh-text mb-1">DGT LiveChess Folder</h4>
          <p className="text-[10px] text-gh-textMuted leading-relaxed">
            Point to the folder where DGT LiveChess writes PGN files. The server watches this in real-time.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="text"
            readOnly
            value={currentPath}
            placeholder="e.g. /Users/you/Documents/DGT/LiveChess"
            className="flex-1 px-3 py-2 bg-gh-bg rounded border border-gh-border text-xs text-gh-text font-mono truncate focus:outline-none cursor-default"
          />
          {isElectron && (
            <button onClick={onPathSelect} className="shrink-0 px-3 py-2 text-xs bg-gh-btnDefault border border-gh-btnDefaultBorder rounded hover:bg-gh-surface transition-colors text-gh-text">
              Browse...
            </button>
          )}
        </div>
      </div>

      <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.05] p-4">
        <h4 className="text-xs font-semibold text-emerald-400 mb-2">Expected folder structure</h4>
        <pre className="text-[10px] text-gh-textMuted font-mono leading-relaxed">{`LiveChess/
  round-1/
    game-1.pgn
    game-2.pgn
    ...
  round-2/
    game-1.pgn
    ...`}</pre>
        <p className="text-[10px] text-gh-textMuted mt-2">The simulator creates this structure automatically for testing.</p>
      </div>

      <div className="rounded-lg border border-blue-500/20 bg-blue-500/[0.05] p-3">
        <p className="text-[10px] text-gh-textMuted leading-relaxed">
          <strong className="text-blue-400">No DGT boards?</strong> Use the built-in Game Simulator on the Home page to test with famous historical games.
        </p>
      </div>
    </div>
  );
}

function StepTournament() {
  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.05] p-4 hover:bg-emerald-500/[0.08] transition-colors">
          <TrophyIcon className="w-5 h-5 text-emerald-400 mb-2" />
          <p className="text-xs font-medium text-emerald-400">Round Robin</p>
          <p className="text-[10px] text-gh-textMuted mt-1 leading-relaxed">
            Everyone plays everyone. Pairings generated via Berger tables. Best for smaller fields (4-16 players).
          </p>
        </div>
        <div className="rounded-lg border border-blue-500/20 bg-blue-500/[0.05] p-4 hover:bg-blue-500/[0.08] transition-colors">
          <SwissIcon className="w-5 h-5 text-blue-400 mb-2" />
          <p className="text-xs font-medium text-blue-400">Swiss</p>
          <p className="text-[10px] text-gh-textMuted mt-1 leading-relaxed">
            Players paired by score each round. Fewer rounds for large fields (20-200 players).
          </p>
        </div>
      </div>

      <div className="rounded-lg border border-gh-border/50 bg-white/[0.02] p-4 space-y-2">
        <h4 className="text-xs font-semibold text-gh-text">What the tournament wizard does</h4>
        <div className="space-y-1.5">
          {[
            "Enter event details (name, date, venue, time control)",
            "Add players (name + rating, or paste a CSV list)",
            "Choose format and number of rounds",
            "Auto-generates pairings and PGN stubs for each round",
            "Live crosstable and standings update as results come in",
          ].map((text, i) => (
            <div key={i} className="flex items-start gap-2">
              <svg className="w-3 h-3 text-emerald-400 shrink-0 mt-0.5" viewBox="0 0 16 16" fill="currentColor">
                <path d="M8 16A8 8 0 108 0a8 8 0 000 16zm3.78-9.72a.75.75 0 00-1.06-1.06L7 8.94 5.28 7.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l4.25-4.25z" />
              </svg>
              <p className="text-[10px] text-gh-textMuted leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-amber-500/20 bg-amber-500/[0.05] p-3">
        <p className="text-[10px] text-gh-textMuted leading-relaxed">
          <strong className="text-amber-400">Casual mode:</strong> Don't need tournament management? Just start boards and open the Live view. Games appear automatically as PGN files are detected.
        </p>
      </div>
    </div>
  );
}

function StepBroadcast({ config }) {
  const serverURL = config?.network?.serverURL || "http://<your-ip>:8080";
  const spectatorURL = config?.network?.spectatorURL || "http://<your-ip>:8080/live";
  const lanIP = config?.network?.lanIP || "detecting...";

  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div className="rounded-lg border border-gh-border/50 bg-white/[0.02] p-4 space-y-3">
        <h4 className="text-xs font-semibold text-gh-text">Local Network Broadcasting</h4>
        <p className="text-[10px] text-gh-textMuted leading-relaxed">
          Anyone on the same Wi-Fi network can watch by visiting the spectator URL in their browser:
        </p>
        <div className="bg-gh-bg rounded-lg p-3 border border-gh-border/30">
          <p className="text-[10px] text-gh-textMuted mb-1">Spectator URL</p>
          <code className="text-sm font-mono text-emerald-400">{spectatorURL}</code>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="bg-gh-bg rounded p-2 border border-gh-border/30">
            <p className="text-[9px] text-gh-textMuted">LAN IP</p>
            <p className="text-[11px] font-mono text-gh-text">{lanIP}</p>
          </div>
          <div className="bg-gh-bg rounded p-2 border border-gh-border/30">
            <p className="text-[9px] text-gh-textMuted">Server</p>
            <p className="text-[11px] font-mono text-gh-text truncate">{serverURL}</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg border border-gh-border/50 bg-white/[0.02] p-4 space-y-3">
        <h4 className="text-xs font-semibold text-gh-text">Live View Features</h4>
        <div className="grid grid-cols-3 gap-2 text-[10px]">
          {[
            { label: "Multi-board grid", icon: "grid" },
            { label: "Engine eval bars", icon: "chart" },
            { label: "Live clocks", icon: "clock" },
            { label: "Featured board", icon: "star" },
            { label: "TV auto-cycle", icon: "tv" },
            { label: "QR code sharing", icon: "qr" },
          ].map(({ label }) => (
            <div key={label} className="p-2 rounded border border-gh-border/30 bg-white/[0.01] text-center">
              <p className="text-gh-text">{label}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-gh-border/50 bg-white/[0.02] p-4">
        <h4 className="text-xs font-semibold text-gh-text mb-2">Keyboard Shortcuts</h4>
        <div className="grid grid-cols-2 gap-1.5 text-[10px]">
          {[
            { key: "F", action: "Toggle fullscreen" },
            { key: "T", action: "Toggle TV mode" },
            { key: "S", action: "Open settings" },
            { key: "Q", action: "Toggle QR code" },
          ].map(({ key, action }) => (
            <div key={key} className="flex items-center gap-2">
              <kbd className="px-1.5 py-0.5 bg-gh-bg border border-gh-border rounded text-gh-text font-mono text-[10px] min-w-[20px] text-center">{key}</kbd>
              <span className="text-gh-textMuted">{action}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function StepCloud() {
  return (
    <div className="space-y-4 max-w-md mx-auto">
      <CloudDiagram />

      <div className="rounded-lg border border-gh-border/50 bg-white/[0.02] p-4 space-y-3">
        <h4 className="text-xs font-semibold text-gh-text">How cloud relay works</h4>
        <div className="space-y-2">
          {[
            { num: "1", text: "Your desktop app connects to the cloud relay server via WebSocket" },
            { num: "2", text: "Game updates and Stockfish analysis are forwarded in real-time" },
            { num: "3", text: "Spectators visit the public watch page and see your broadcast live" },
          ].map(({ num, text }) => (
            <div key={num} className="flex items-start gap-2">
              <span className="flex items-center justify-center w-5 h-5 rounded bg-blue-500/[0.1] border border-blue-500/20 text-blue-400 text-[9px] font-bold shrink-0">{num}</span>
              <p className="text-[10px] text-gh-textMuted leading-relaxed">{text}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/[0.05] p-4 space-y-2">
        <h4 className="text-xs font-semibold text-emerald-400">Getting started</h4>
        <p className="text-[10px] text-gh-textMuted leading-relaxed">
          On the Home dashboard, open the <strong className="text-gh-text">Cloud Relay</strong> section. Enter an event ID (or leave blank for auto), then click <strong className="text-emerald-400">Go Live</strong>.
        </p>
        <p className="text-[10px] text-gh-textMuted leading-relaxed">
          Share the watch URL with anyone. Stockfish runs on your machine, so there's zero compute cost for viewers.
        </p>
      </div>

      <div className="rounded-lg border border-amber-500/20 bg-amber-500/[0.05] p-3">
        <p className="text-[10px] text-gh-textMuted leading-relaxed">
          <strong className="text-amber-400">Self-hosting:</strong> The relay server is open-source. Deploy your own on any cloud platform, or use the hosted instance at <code className="text-amber-400/80">fly.dev</code>.
        </p>
      </div>
    </div>
  );
}

function StepOBS() {
  return (
    <div className="space-y-4 max-w-md mx-auto">
      <div className="rounded-lg border border-gh-border/50 bg-white/[0.02] p-4 space-y-3">
        <h4 className="text-xs font-semibold text-gh-text">OBS Browser Source Widgets</h4>
        <p className="text-[10px] text-gh-textMuted leading-relaxed">
          Add chess overlays to your OBS/Streamlabs stream using Browser Sources. Each widget type has a URL you add in OBS.
        </p>
      </div>

      <OBSPreview />

      <div className="rounded-lg border border-blue-500/20 bg-blue-500/[0.05] p-4 space-y-2">
        <h4 className="text-xs font-semibold text-blue-400 flex items-center gap-1.5">
          <InfoIcon className="w-3.5 h-3.5" />
          How to add in OBS
        </h4>
        <div className="space-y-1.5 text-[10px] text-gh-textMuted leading-relaxed">
          <p>1. In OBS, click <strong className="text-gh-text">+</strong> in Sources and select <strong className="text-gh-text">Browser</strong></p>
          <p>2. Paste the widget URL (use your server's LAN address)</p>
          <p>3. Set width/height to match your scene (e.g. 400x500 for a board)</p>
          <p>4. The background is transparent by default for easy compositing</p>
        </div>
      </div>

      <div className="rounded-lg border border-gh-border/50 bg-white/[0.02] p-3">
        <p className="text-[10px] text-gh-textMuted leading-relaxed">
          <strong className="text-gh-text">Tip:</strong> OBS URLs and all widget types are also available in the Live view's Settings panel (gear icon), or in the OBS section on the Home dashboard.
        </p>
      </div>
    </div>
  );
}

function StepReady() {
  return (
    <div className="text-center space-y-6 max-w-md mx-auto">
      <div className="w-16 h-16 rounded-2xl bg-emerald-500/[0.15] border border-emerald-500/30 flex items-center justify-center mx-auto">
        <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div>
        <p className="text-sm text-gh-text leading-relaxed mb-4">
          You're ready to broadcast! Here's your quick-start checklist:
        </p>
        <div className="space-y-2 text-left">
          {[
            { num: "1", title: "Test with the Simulator", desc: "Home > Simulator > Start a few boards to see everything working" },
            { num: "2", title: "Open the Live View", desc: "Watch your simulated games with eval bars and clocks" },
            { num: "3", title: "Go public with Cloud Relay", desc: "Home > Cloud Relay > Go Live to share with the world" },
            { num: "4", title: "Set up OBS overlays", desc: "Home > OBS Integration for widget URLs to add to your stream" },
          ].map(({ num, title, desc }) => (
            <div key={num} className="flex gap-3 items-start p-2.5 rounded-lg border border-gh-border/30 bg-white/[0.02] hover:bg-white/[0.04] transition-colors">
              <span className="flex items-center justify-center w-6 h-6 rounded-md bg-emerald-500/[0.1] border border-emerald-500/20 text-emerald-400 text-[10px] font-bold shrink-0">{num}</span>
              <div>
                <p className="text-[11px] text-gh-text font-medium">{title}</p>
                <p className="text-[10px] text-gh-textMuted leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Icons ---

function BoardsIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25a2.25 2.25 0 01-2.25-2.25v-2.25z" />
    </svg>
  );
}

function EngineIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
    </svg>
  );
}

function GlobeIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
    </svg>
  );
}

function InfoIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
    </svg>
  );
}

function FileIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  );
}

function ServerIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M5.25 14.25h13.5m-13.5 0a3 3 0 01-3-3m3 3a3 3 0 100 6h13.5a3 3 0 100-6m-16.5-3a3 3 0 013-3h13.5a3 3 0 013 3m-19.5 0a4.5 4.5 0 01.9-2.7L5.737 5.1a3.375 3.375 0 012.7-1.35h7.126c1.062 0 2.062.5 2.7 1.35l2.587 3.45a4.5 4.5 0 01.9 2.7m0 0a3 3 0 01-3 3m0 3h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008zm-3 6h.008v.008h-.008v-.008zm0-6h.008v.008h-.008v-.008z" />
    </svg>
  );
}

function ScreenIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
    </svg>
  );
}

function LaptopIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25A2.25 2.25 0 015.25 3h13.5A2.25 2.25 0 0121 5.25z" />
    </svg>
  );
}

function CloudIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15a4.5 4.5 0 004.5 4.5H18a3.75 3.75 0 001.332-7.257 3 3 0 00-3.758-3.848 5.25 5.25 0 00-10.233 2.33A4.502 4.502 0 002.25 15z" />
    </svg>
  );
}

function TrophyIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M18.75 4.236c.982.143 1.954.317 2.916.52A6.003 6.003 0 0016.27 9.728M18.75 4.236V4.5c0 2.108-.966 3.99-2.48 5.228m0 0a6.02 6.02 0 01-7.54 0" />
    </svg>
  );
}

function SwissIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
    </svg>
  );
}

// --- Main Wizard ---

const STORAGE_KEY = "broadcast-welcome-completed";

export default function WelcomeWizard({ onComplete }) {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [config, setConfig] = useState(null);
  const [direction, setDirection] = useState(1); // 1 = forward, -1 = back

  useEffect(() => {
    fetch(`${API}/api/config`)
      .then((r) => r.json())
      .then(setConfig)
      .catch(() => {});
  }, []);

  const handlePathSelect = async () => {
    if (window.electronAPI?.selectDGTPath) {
      await window.electronAPI.selectDGTPath();
      const res = await fetch(`${API}/api/config`);
      setConfig(await res.json());
    }
  };

  const handleFinish = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    onComplete?.();
  };

  const goNext = () => { setDirection(1); setStep((s) => Math.min(s + 1, STEPS.length - 1)); };
  const goBack = () => { setDirection(-1); setStep((s) => Math.max(s - 1, 0)); };

  const isLastStep = step === STEPS.length - 1;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gh-bg/95 backdrop-blur-sm">
      <div className="w-full max-w-xl mx-4">
        <div className="rounded-xl border border-gh-border bg-gh-surface/80 backdrop-blur-xl shadow-2xl overflow-hidden">
          {/* Progress bar */}
          <div className="px-6 pt-5 pb-3">
            <div className="flex items-center gap-1 mb-4">
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => { setDirection(i > step ? 1 : -1); setStep(i); }}
                  className={`h-1 flex-1 rounded-full transition-all duration-300 cursor-pointer hover:opacity-80 ${
                    i <= step ? "bg-emerald-400" : "bg-gh-border"
                  }`}
                />
              ))}
            </div>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-base font-semibold text-gh-text">{STEPS[step].title}</h2>
                <p className="text-xs text-gh-textMuted mt-0.5">{STEPS[step].subtitle}</p>
              </div>
              <span className="text-[10px] text-gh-textMuted tabular-nums">{step + 1} / {STEPS.length}</span>
            </div>
          </div>

          {/* Content with slide animation */}
          <div className="px-6 py-5 min-h-[380px] flex flex-col justify-center overflow-hidden">
            <div
              key={step}
              className="animate-slideIn"
              style={{ "--slide-from": direction > 0 ? "20px" : "-20px" }}
            >
              {step === 0 && <StepWelcome />}
              {step === 1 && <StepHowItWorks />}
              {step === 2 && <StepDGT config={config} onPathSelect={handlePathSelect} />}
              {step === 3 && <StepTournament />}
              {step === 4 && <StepBroadcast config={config} />}
              {step === 5 && <StepCloud />}
              {step === 6 && <StepOBS />}
              {step === 7 && <StepReady />}
            </div>
          </div>

          {/* Navigation */}
          <div className="px-6 py-4 border-t border-gh-border/50 flex items-center justify-between">
            <div>
              {step > 0 ? (
                <button onClick={goBack} className="px-4 py-2 text-xs text-gh-textMuted hover:text-gh-text transition-colors">
                  Back
                </button>
              ) : (
                <button onClick={handleFinish} className="px-4 py-2 text-xs text-gh-textMuted hover:text-gh-text transition-colors">
                  Skip setup
                </button>
              )}
            </div>

            {isLastStep ? (
              <div className="flex gap-2">
                <button
                  onClick={() => { handleFinish(); navigate("/tournament"); }}
                  className="px-4 py-2 text-xs text-gh-text bg-gh-btnDefault border border-gh-btnDefaultBorder rounded-md hover:bg-gh-surface transition-colors"
                >
                  Create Tournament
                </button>
                <button
                  onClick={() => { handleFinish(); navigate("/"); }}
                  className="px-4 py-2 text-xs font-medium text-black bg-emerald-400 rounded-md hover:bg-emerald-300 transition-colors"
                >
                  Get Started
                </button>
              </div>
            ) : (
              <button
                onClick={goNext}
                className="px-4 py-2 text-xs font-medium text-black bg-emerald-400 rounded-md hover:bg-emerald-300 transition-colors"
              >
                Continue
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export function useWelcomeWizard() {
  const [completed, setCompleted] = useState(() => {
    return localStorage.getItem(STORAGE_KEY) === "true";
  });

  return {
    showWelcome: !completed,
    markComplete: () => {
      localStorage.setItem(STORAGE_KEY, "true");
      setCompleted(true);
    },
    reset: () => {
      localStorage.removeItem(STORAGE_KEY);
      setCompleted(false);
    },
  };
}
