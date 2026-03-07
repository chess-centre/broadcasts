import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useNetworkInfo from "../hooks/useNetworkInfo";
import { useWelcomeWizard } from "../components/WelcomeWizard";

const SECTIONS = [
  { id: "overview", label: "Overview" },
  { id: "setup", label: "Getting Started" },
  { id: "dgt", label: "DGT Boards" },
  { id: "tournament", label: "Tournaments" },
  { id: "live", label: "Live View" },
  { id: "cloud", label: "Cloud Relay" },
  { id: "obs", label: "OBS / Streaming" },
  { id: "troubleshooting", label: "Troubleshooting" },
];

function SideNav({ active, onSelect }) {
  return (
    <nav className="space-y-0.5">
      {SECTIONS.map((s) => (
        <button
          key={s.id}
          onClick={() => onSelect(s.id)}
          className={`w-full text-left px-3 py-1.5 rounded text-xs transition-colors ${
            active === s.id
              ? "bg-emerald-500/[0.1] text-emerald-400 font-medium"
              : "text-gh-textMuted hover:text-gh-text hover:bg-white/[0.02]"
          }`}
        >
          {s.label}
        </button>
      ))}
    </nav>
  );
}

function Heading({ children }) {
  return <h2 className="text-sm font-semibold text-gh-text mb-3">{children}</h2>;
}

function SubHeading({ children }) {
  return <h3 className="text-xs font-semibold text-gh-text mt-5 mb-2">{children}</h3>;
}

function P({ children }) {
  return <p className="text-[11px] text-gh-textMuted leading-relaxed mb-2">{children}</p>;
}

function Code({ children }) {
  return <code className="text-[10px] font-mono text-emerald-400/80 bg-gh-bg px-1.5 py-0.5 rounded border border-gh-border/30">{children}</code>;
}

function CodeBlock({ children }) {
  return (
    <pre className="text-[10px] font-mono text-gh-textMuted bg-gh-bg rounded-lg p-3 border border-gh-border/30 mb-3 overflow-x-auto">{children}</pre>
  );
}

function Tip({ children, color = "blue" }) {
  const colors = {
    blue: "border-blue-500/20 bg-blue-500/[0.05] text-blue-400",
    green: "border-emerald-500/20 bg-emerald-500/[0.05] text-emerald-400",
    amber: "border-amber-500/20 bg-amber-500/[0.05] text-amber-400",
  };
  return (
    <div className={`rounded-lg border p-3 mb-3 ${colors[color]}`}>
      <p className="text-[10px] leading-relaxed">{children}</p>
    </div>
  );
}

function OverviewSection() {
  return (
    <div>
      <Heading>Overview</Heading>
      <P>
        Chess Broadcast is a professional live broadcasting system for chess tournaments.
        It connects DGT electronic boards to spectators via web browsers, with built-in
        Stockfish analysis, tournament management, and streaming overlays.
      </P>
      <SubHeading>Architecture</SubHeading>
      <CodeBlock>{`DGT Board  -->  LiveChess Software  -->  PGN Files
                                            |
                                    Broadcast Server (port 8080)
                                     |              |
                              Stockfish Engine    WebSocket
                                     |              |
                               Eval Analysis    Spectators
                                                    |
                                          Local LAN  /  Cloud Relay`}</CodeBlock>
      <SubHeading>Key features</SubHeading>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {[
          "Up to 20 simultaneous boards",
          "Stockfish 16 engine analysis",
          "Live eval bars and accuracy",
          "Tournament pairings & standings",
          "Round Robin and Swiss formats",
          "Cloud relay for public broadcasts",
          "OBS browser source widgets",
          "QR code sharing",
          "TV/kiosk auto-cycle mode",
          "Game simulator for testing",
        ].map((f) => (
          <div key={f} className="flex items-center gap-1.5 text-[10px] text-gh-textMuted">
            <svg className="w-3 h-3 text-emerald-400 shrink-0" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8 16A8 8 0 108 0a8 8 0 000 16zm3.78-9.72a.75.75 0 00-1.06-1.06L7 8.94 5.28 7.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.06 0l4.25-4.25z" />
            </svg>
            {f}
          </div>
        ))}
      </div>
    </div>
  );
}

function SetupSection() {
  const navigate = useNavigate();
  const { reset: resetWelcome } = useWelcomeWizard();

  const handleRerunWizard = () => {
    resetWelcome();
    window.location.reload();
  };

  return (
    <div>
      <Heading>Getting Started</Heading>
      <P>The quickest way to get started is with the interactive setup wizard.</P>
      <button
        onClick={handleRerunWizard}
        className="mb-4 px-3 py-1.5 text-xs font-medium text-black bg-emerald-400 rounded hover:bg-emerald-300 transition-colors"
      >
        Run Setup Wizard
      </button>

      <SubHeading>Quick start (no DGT boards)</SubHeading>
      <div className="space-y-1.5 mb-3">
        {[
          "Open the Home dashboard",
          'Expand the "Simulator" section',
          "Choose number of boards and speed, then click Start Simulator",
          'Click "Open Live View" to watch the simulated games',
        ].map((step, i) => (
          <div key={i} className="flex items-start gap-2 text-[10px] text-gh-textMuted">
            <span className="flex items-center justify-center w-4 h-4 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-bold shrink-0">{i + 1}</span>
            <span className="leading-relaxed">{step}</span>
          </div>
        ))}
      </div>

      <SubHeading>Quick start (with DGT boards)</SubHeading>
      <div className="space-y-1.5 mb-3">
        {[
          "Install and open DGT LiveChess software",
          "Configure it to write PGN files to a folder",
          "In Chess Broadcast, set the DGT path to that folder",
          "Start your games on the DGT boards",
          "Open the Live View - games appear automatically",
        ].map((step, i) => (
          <div key={i} className="flex items-start gap-2 text-[10px] text-gh-textMuted">
            <span className="flex items-center justify-center w-4 h-4 rounded bg-blue-500/10 text-blue-400 text-[9px] font-bold shrink-0">{i + 1}</span>
            <span className="leading-relaxed">{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function DGTSection() {
  return (
    <div>
      <Heading>DGT Board Setup</Heading>
      <P>
        Chess Broadcast works by watching a folder where DGT LiveChess writes PGN files.
        Each game gets its own file, organised by round.
      </P>

      <SubHeading>Expected folder structure</SubHeading>
      <CodeBlock>{`YourFolder/
  round-1/
    game-1.pgn    (Board 1)
    game-2.pgn    (Board 2)
    game-3.pgn    (Board 3)
  round-2/
    game-1.pgn
    ...`}</CodeBlock>

      <SubHeading>DGT LiveChess configuration</SubHeading>
      <P>In DGT LiveChess:</P>
      <div className="space-y-1 mb-3">
        {[
          'Set "Output Format" to PGN',
          'Set the output directory to your chosen folder',
          "Enable clock data output (for live clocks)",
          "Make sure file names follow the game-N.pgn convention",
        ].map((s, i) => (
          <div key={i} className="flex items-start gap-2 text-[10px] text-gh-textMuted">
            <span className="text-emerald-400">-</span>
            <span>{s}</span>
          </div>
        ))}
      </div>

      <SubHeading>Setting the path</SubHeading>
      <P>
        On the Home dashboard, the DGT path is shown in the Broadcast section.
        Click <strong className="text-gh-text">Browse</strong> to select the folder, or type the path directly.
      </P>

      <Tip color="amber">
        <strong>File watching:</strong> The server uses real-time file watchers. Changes are detected
        within 100ms. You do not need to restart the server when games are in progress.
      </Tip>
    </div>
  );
}

function TournamentSection() {
  return (
    <div>
      <Heading>Tournament Management</Heading>
      <P>
        Create a tournament to get automatic pairings, standings, and a live crosstable.
        Navigate to the Tournament page from the header navigation.
      </P>

      <SubHeading>Supported formats</SubHeading>
      <div className="grid grid-cols-2 gap-3 mb-3">
        <div className="rounded-lg border border-gh-border/50 p-3">
          <p className="text-xs font-medium text-emerald-400 mb-1">Round Robin</p>
          <P>Every player plays every other player. Pairings use Berger tables for optimal colour balance. Best for 4-16 players.</P>
        </div>
        <div className="rounded-lg border border-gh-border/50 p-3">
          <p className="text-xs font-medium text-blue-400 mb-1">Swiss</p>
          <P>Players paired by score each round. Efficient for large fields (20-200+ players). Fewer rounds needed.</P>
        </div>
      </div>

      <SubHeading>Creating a tournament</SubHeading>
      <div className="space-y-1.5 mb-3">
        {[
          "Go to the Tournament page",
          "Enter event details: name, date, venue, time control",
          "Add players with names and ratings (or paste CSV)",
          "Choose format and number of rounds",
          "Click Create - pairings and PGN files are generated automatically",
        ].map((s, i) => (
          <div key={i} className="flex items-start gap-2 text-[10px] text-gh-textMuted">
            <span className="flex items-center justify-center w-4 h-4 rounded bg-emerald-500/10 text-emerald-400 text-[9px] font-bold shrink-0">{i + 1}</span>
            <span className="leading-relaxed">{s}</span>
          </div>
        ))}
      </div>

      <SubHeading>Tournament views</SubHeading>
      <P>
        The tournament dashboard has three tabs: <strong className="text-gh-text">Pairings</strong> (per-round matchups),{" "}
        <strong className="text-gh-text">Standings</strong> (live leaderboard), and{" "}
        <strong className="text-gh-text">Crosstable</strong> (head-to-head results matrix).
      </P>

      <Tip>
        <strong>Casual mode:</strong> You don't need to create a tournament. Just start games and open the Live view.
        The server detects PGN files automatically regardless of tournament state.
      </Tip>
    </div>
  );
}

function LiveViewSection() {
  return (
    <div>
      <Heading>Live View</Heading>
      <P>
        The Live view is the main spectator interface. It shows a grid of all active boards
        with real-time position updates, evaluation bars, clocks, and player information.
      </P>

      <SubHeading>Display features</SubHeading>
      <div className="grid grid-cols-2 gap-2 mb-3">
        {[
          { label: "Multi-board grid", desc: "All games visible simultaneously" },
          { label: "Eval bars", desc: "Stockfish evaluation per board" },
          { label: "Live clocks", desc: "DGT clock countdown" },
          { label: "Best move arrows", desc: "Engine's top move drawn on board" },
          { label: "Featured board", desc: "Auto-highlights the most exciting game" },
          { label: "Win probability", desc: "Percentage bar based on evaluation" },
          { label: "Player accuracy", desc: "ACPL-based accuracy per player" },
          { label: "Critical moments", desc: "Blunder/brilliancy detection" },
          { label: "Opening names", desc: "ECO opening classification" },
          { label: "Move time chart", desc: "Time spent per move" },
        ].map(({ label, desc }) => (
          <div key={label} className="p-2 rounded border border-gh-border/30 bg-white/[0.01]">
            <p className="text-[10px] text-gh-text font-medium">{label}</p>
            <p className="text-[9px] text-gh-textMuted">{desc}</p>
          </div>
        ))}
      </div>

      <SubHeading>Settings panel</SubHeading>
      <P>
        Click the gear icon in the Live view to open settings. Toggle individual features on/off,
        change board themes, animation speeds, and branding.
      </P>

      <SubHeading>TV / Kiosk mode</SubHeading>
      <P>
        Press <Code>T</Code> in the Live view to activate TV mode. The display auto-cycles through boards,
        pausing on the most interesting games. Configure the cycle interval and standings frequency in settings.
      </P>

      <SubHeading>Keyboard shortcuts</SubHeading>
      <div className="grid grid-cols-2 gap-1.5 mb-3">
        {[
          { key: "F", action: "Toggle fullscreen" },
          { key: "T", action: "Toggle TV auto-cycle mode" },
          { key: "S", action: "Open display settings" },
          { key: "Q", action: "Toggle QR code overlay" },
          { key: "Left/Right", action: "Navigate boards" },
          { key: "Esc", action: "Exit fullscreen / close modals" },
        ].map(({ key, action }) => (
          <div key={key} className="flex items-center gap-2 text-[10px]">
            <kbd className="px-1.5 py-0.5 bg-gh-bg border border-gh-border rounded text-gh-text font-mono text-[9px] min-w-[24px] text-center">{key}</kbd>
            <span className="text-gh-textMuted">{action}</span>
          </div>
        ))}
      </div>

      <SubHeading>Sharing with local spectators</SubHeading>
      <P>
        Anyone on the same Wi-Fi network can watch by opening the Spectator URL in their browser.
        The URL is shown on the Home dashboard and can be shared via QR code in the Live view.
      </P>
    </div>
  );
}

function CloudRelaySection() {
  return (
    <div>
      <Heading>Cloud Relay</Heading>
      <P>
        The cloud relay lets you broadcast to anyone on the internet. Your desktop app connects
        to a relay server, which forwards game updates and Stockfish analysis to web viewers.
      </P>

      <SubHeading>How it works</SubHeading>
      <CodeBlock>{`Your Desktop App  ---->  Cloud Relay (Fly.io)  ---->  Web Spectators
  (Stockfish runs         (Forwards data,           (Any browser,
   on your machine)        zero compute cost)         anywhere)`}</CodeBlock>

      <SubHeading>Going live</SubHeading>
      <div className="space-y-1.5 mb-3">
        {[
          'On the Home dashboard, open the "Cloud Relay" section',
          "The relay server URL is pre-filled with the hosted instance",
          "Enter an Event ID (or leave blank for auto-generated)",
          "Enter a Secret (or leave blank for auto-generated)",
          'Click "Go Live" - your broadcast is now public',
          "Share the Watch URL with spectators",
        ].map((s, i) => (
          <div key={i} className="flex items-start gap-2 text-[10px] text-gh-textMuted">
            <span className="flex items-center justify-center w-4 h-4 rounded bg-blue-500/10 text-blue-400 text-[9px] font-bold shrink-0">{i + 1}</span>
            <span className="leading-relaxed">{s}</span>
          </div>
        ))}
      </div>

      <SubHeading>Event ID and Secret</SubHeading>
      <P>
        The <strong className="text-gh-text">Event ID</strong> is the public identifier viewers use to find your broadcast
        (e.g. <Code>london-classic-2026</Code>). The <strong className="text-gh-text">Secret</strong> prevents
        others from publishing to your event. Keep it private.
      </P>

      <SubHeading>What gets relayed</SubHeading>
      <P>
        All game updates (moves, positions, clocks, player info) and Stockfish evaluations
        (eval bars, accuracy, engine lines) are forwarded. Late-joining spectators receive
        the current state of all boards immediately.
      </P>

      <Tip color="green">
        <strong>Zero server cost for analysis:</strong> Stockfish runs entirely on your machine.
        The relay just forwards the data. No GPU or compute resources needed on the server side.
      </Tip>

      <Tip color="amber">
        <strong>Self-hosting:</strong> The relay server is open-source. Deploy your own instance
        on Fly.io, Railway, or any platform that supports WebSockets and Node.js.
      </Tip>
    </div>
  );
}

function OBSGuideSection() {
  const { getBroadcastURL } = useNetworkInfo();
  const base = getBroadcastURL("");

  const widgets = [
    { type: "board", label: "Single Board", url: `${base}/obs?type=board&board=1&round=1`, width: 400, height: 500, desc: "Shows one game with board, eval bar, clocks, and player names." },
    { type: "featured", label: "Featured Board", url: `${base}/obs?type=featured&round=1`, width: 400, height: 500, desc: "Auto-selects the most exciting game based on evaluation swings." },
    { type: "standings", label: "Standings Table", url: `${base}/obs?type=standings&round=1`, width: 350, height: 400, desc: "Live tournament standings. Updates as results are recorded." },
    { type: "ticker", label: "Results Ticker", url: `${base}/obs?type=ticker&round=1`, width: 800, height: 40, desc: "Scrolling results bar. Great for the bottom of your stream layout." },
  ];

  return (
    <div>
      <Heading>OBS / Streaming</Heading>
      <P>
        Add chess overlays to your OBS Studio or Streamlabs stream using Browser Source widgets.
        Each widget connects to your broadcast server and updates in real-time.
      </P>

      <SubHeading>How to add a widget in OBS</SubHeading>
      <div className="space-y-1.5 mb-3">
        {[
          'In OBS, click the "+" button in the Sources panel',
          'Select "Browser" and give it a name',
          "Paste the widget URL (see below)",
          "Set the width and height (recommended sizes below)",
          'The background is transparent by default - composites cleanly over your scene',
        ].map((s, i) => (
          <div key={i} className="flex items-start gap-2 text-[10px] text-gh-textMuted">
            <span className="flex items-center justify-center w-4 h-4 rounded bg-blue-500/10 text-blue-400 text-[9px] font-bold shrink-0">{i + 1}</span>
            <span className="leading-relaxed">{s}</span>
          </div>
        ))}
      </div>

      <SubHeading>Available widgets</SubHeading>
      <div className="space-y-3 mb-3">
        {widgets.map((w) => (
          <div key={w.type} className="rounded-lg border border-gh-border/50 bg-white/[0.02] p-3 space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gh-text">{w.label}</p>
              <span className="text-[9px] text-gh-textMuted">{w.width} x {w.height}</span>
            </div>
            <p className="text-[10px] text-gh-textMuted">{w.desc}</p>
            <code className="block text-[10px] font-mono text-emerald-400/80 bg-gh-bg px-2 py-1.5 rounded border border-gh-border/30 truncate">{w.url}</code>
          </div>
        ))}
      </div>

      <SubHeading>URL parameters</SubHeading>
      <div className="space-y-1 mb-3">
        {[
          { param: "type", desc: "Widget type: board, featured, standings, ticker" },
          { param: "board", desc: "Board number (for board type only)" },
          { param: "round", desc: "Round number to display" },
          { param: "bg", desc: 'Background colour (e.g. bg=#000 or bg=transparent)' },
        ].map(({ param, desc }) => (
          <div key={param} className="flex items-start gap-2 text-[10px]">
            <Code>{param}</Code>
            <span className="text-gh-textMuted">{desc}</span>
          </div>
        ))}
      </div>

      <Tip>
        <strong>Multiple boards:</strong> Add multiple Browser Sources, each pointing to a different board number.
        For example, <Code>/obs?type=board&board=1&round=1</Code> and <Code>/obs?type=board&board=2&round=1</Code>.
      </Tip>

      <Tip color="green">
        <strong>OBS URLs on the dashboard:</strong> All widget URLs with copy buttons are available on the
        Home page under "OBS Integration", and in the Live view's settings panel (gear icon).
      </Tip>
    </div>
  );
}

function TroubleshootingSection() {
  return (
    <div>
      <Heading>Troubleshooting</Heading>

      <SubHeading>No games appearing in Live view</SubHeading>
      <div className="space-y-1 mb-3 text-[10px] text-gh-textMuted">
        <p>- Check the DGT path on the Home dashboard points to the correct folder</p>
        <p>- Verify PGN files exist in <Code>round-N/game-N.pgn</Code> format</p>
        <p>- Check the server is running (green dot in Server section)</p>
        <p>- Try restarting the app or re-subscribing by refreshing the Live view</p>
      </div>

      <SubHeading>Spectators can't connect on local network</SubHeading>
      <div className="space-y-1 mb-3 text-[10px] text-gh-textMuted">
        <p>- Make sure spectators are on the same Wi-Fi network</p>
        <p>- Check that your firewall allows connections on port 8080</p>
        <p>- Verify the LAN IP shown on the dashboard is correct (not 127.0.0.1)</p>
        <p>- Try accessing the URL yourself from a different device</p>
      </div>

      <SubHeading>Cloud relay won't connect</SubHeading>
      <div className="space-y-1 mb-3 text-[10px] text-gh-textMuted">
        <p>- Check your internet connection</p>
        <p>- Verify the relay URL uses <Code>wss://</Code> (not <Code>ws://</Code>) for production</p>
        <p>- If you see "Room already has an organiser", another session is connected with the same event ID</p>
        <p>- Try using a different Event ID or wait 60 seconds for the old session to expire</p>
      </div>

      <SubHeading>Stockfish not running</SubHeading>
      <div className="space-y-1 mb-3 text-[10px] text-gh-textMuted">
        <p>- Check the server status on the Home dashboard</p>
        <p>- The engine starts automatically when the server boots</p>
        <p>- On some systems, the Stockfish binary may need execute permissions</p>
      </div>

      <SubHeading>OBS widgets show blank/error</SubHeading>
      <div className="space-y-1 mb-3 text-[10px] text-gh-textMuted">
        <p>- Make sure the broadcast server is running</p>
        <p>- Use the LAN IP address (not localhost) in the URL</p>
        <p>- Check that the round number in the URL matches the active round</p>
        <p>- In OBS, try "Refresh cache of current page" on the Browser Source</p>
      </div>

      <SubHeading>Clocks not updating</SubHeading>
      <div className="space-y-1 mb-3 text-[10px] text-gh-textMuted">
        <p>- DGT LiveChess must be configured to include clock data in PGN output</p>
        <p>- Check that %clk annotations appear in the PGN files</p>
        <p>- The simulator always includes clock data for testing</p>
      </div>
    </div>
  );
}

export default function Guide() {
  const [active, setActive] = useState("overview");

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 font-mono">
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-xs text-gh-textMuted uppercase tracking-wider">Organiser Guide</h1>
      </div>

      <div className="flex gap-6">
        {/* Side nav */}
        <div className="w-40 shrink-0 sticky top-16 self-start">
          <SideNav active={active} onSelect={setActive} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {active === "overview" && <OverviewSection />}
          {active === "setup" && <SetupSection />}
          {active === "dgt" && <DGTSection />}
          {active === "tournament" && <TournamentSection />}
          {active === "live" && <LiveViewSection />}
          {active === "cloud" && <CloudRelaySection />}
          {active === "obs" && <OBSGuideSection />}
          {active === "troubleshooting" && <TroubleshootingSection />}
        </div>
      </div>
    </div>
  );
}
