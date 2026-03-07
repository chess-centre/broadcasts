import { WebSocketServer, WebSocket } from "ws";
import http from "http";

const PORT = parseInt(process.env.PORT || "3001", 10);

interface Room {
  organiser: WebSocket | null;
  secret: string;
  spectators: Set<WebSocket>;
  eventName?: string;
  lastState: Map<number, string>; // board -> last message JSON (for late joiners)
}

const rooms = new Map<string, Room>();

const server = http.createServer((req, res) => {
  const url = new URL(req.url || "/", `http://${req.headers.host || "localhost"}`);

  // Health check
  if (url.pathname === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      ok: true,
      rooms: rooms.size,
      spectators: Array.from(rooms.values()).reduce((sum, r) => sum + r.spectators.size, 0),
    }));
    return;
  }

  // List active events
  if (url.pathname === "/events") {
    const events = Array.from(rooms.entries())
      .filter(([, r]) => r.organiser !== null)
      .map(([id, r]) => ({
        id,
        name: r.eventName || id,
        spectators: r.spectators.size,
        boards: r.lastState.size,
      }));
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify(events));
    return;
  }

  // Spectator viewer page: /watch/:eventId
  const watchMatch = url.pathname.match(/^\/watch\/([a-zA-Z0-9_-]+)$/);
  if (watchMatch) {
    const eventId = watchMatch[1];
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(buildSpectatorPage(eventId));
    return;
  }

  // Root - list active events or show landing
  if (url.pathname === "/") {
    const events = Array.from(rooms.entries())
      .filter(([, r]) => r.organiser !== null)
      .map(([id, r]) => ({
        id,
        name: r.eventName || id,
        spectators: r.spectators.size,
        boards: r.lastState.size,
      }));
    res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
    res.end(buildLandingPage(events));
    return;
  }

  res.writeHead(404);
  res.end("Not found");
});

const wss = new WebSocketServer({ server });

wss.on("connection", (ws) => {
  let role: "organiser" | "spectator" | null = null;
  let eventId: string | null = null;

  ws.on("message", (raw) => {
    try {
      const msg = JSON.parse(raw.toString());

      switch (msg.type) {
        // Organiser authenticates and creates/joins a room
        case "relay_auth": {
          const room = getOrCreateRoom(msg.eventId, msg.secret);
          if (room.organiser && room.organiser.readyState === WebSocket.OPEN) {
            ws.send(JSON.stringify({ type: "error", message: "Room already has an organiser" }));
            return;
          }
          if (room.secret !== msg.secret) {
            ws.send(JSON.stringify({ type: "error", message: "Invalid secret" }));
            return;
          }
          room.organiser = ws;
          if (msg.eventName) room.eventName = msg.eventName;
          role = "organiser";
          eventId = msg.eventId;
          ws.send(JSON.stringify({ type: "relay_authed", eventId: msg.eventId }));
          console.log(`[relay] Organiser connected: ${msg.eventId}`);
          break;
        }

        // Organiser publishes a game/eval update
        case "relay_publish": {
          if (role !== "organiser" || !eventId) return;
          const room = rooms.get(eventId);
          if (!room) return;

          const payload = JSON.stringify(msg.message);

          // Cache latest state per board for late joiners
          if (msg.message?.type === "game_update" && msg.message.board != null) {
            room.lastState.set(msg.message.board, payload);
          }

          // Fan out to all spectators
          room.spectators.forEach((spectator) => {
            if (spectator.readyState === WebSocket.OPEN) {
              spectator.send(payload);
            }
          });
          break;
        }

        // Spectator subscribes to an event
        case "relay_subscribe": {
          const room = rooms.get(msg.eventId);
          if (!room) {
            ws.send(JSON.stringify({ type: "error", message: "Event not found" }));
            return;
          }
          room.spectators.add(ws);
          role = "spectator";
          eventId = msg.eventId;
          ws.send(JSON.stringify({ type: "relay_subscribed", eventId: msg.eventId }));
          console.log(`[relay] Spectator joined: ${msg.eventId} (${room.spectators.size} total)`);

          // Send cached state so late joiners see current boards
          room.lastState.forEach((payload) => {
            ws.send(payload);
          });
          break;
        }

        case "ping":
          ws.send(JSON.stringify({ type: "pong" }));
          break;
      }
    } catch (err) {
      console.error("[relay] Message parse error:", err);
    }
  });

  ws.on("close", () => {
    if (!eventId) return;
    const room = rooms.get(eventId);
    if (!room) return;

    if (role === "organiser") {
      room.organiser = null;
      console.log(`[relay] Organiser disconnected: ${eventId}`);
      // Clean up room after a delay if organiser doesn't reconnect
      setTimeout(() => {
        const r = rooms.get(eventId!);
        if (r && !r.organiser && r.spectators.size === 0) {
          rooms.delete(eventId!);
          console.log(`[relay] Room cleaned up: ${eventId}`);
        }
      }, 60000);
    } else if (role === "spectator") {
      room.spectators.delete(ws);
      console.log(`[relay] Spectator left: ${eventId} (${room.spectators.size} remaining)`);
    }
  });
});

function getOrCreateRoom(eventId: string, secret: string): Room {
  if (!rooms.has(eventId)) {
    rooms.set(eventId, {
      organiser: null,
      secret,
      spectators: new Set(),
      lastState: new Map(),
    });
  }
  return rooms.get(eventId)!;
}

// --- HTML page builders ---

function buildLandingPage(events: { id: string; name: string; spectators: number; boards: number }[]): string {
  const eventList = events.length > 0
    ? events.map(e => `<a href="/watch/${e.id}" style="display:block;padding:16px;border:1px solid #1e293b;border-radius:12px;text-decoration:none;color:inherit;transition:border-color 0.2s" onmouseover="this.style.borderColor='#34d399'" onmouseout="this.style.borderColor='#1e293b'"><div style="display:flex;justify-content:space-between;align-items:center"><span style="font-weight:600;color:#e2e8f0">${esc(e.name)}</span><span style="font-size:12px;color:#34d399">${e.boards} board${e.boards !== 1 ? 's' : ''} live</span></div><div style="font-size:12px;color:#64748b;margin-top:4px">${e.spectators} spectator${e.spectators !== 1 ? 's' : ''} watching &middot; ${esc(e.id)}</div></a>`).join("")
    : `<div style="text-align:center;padding:48px 0;color:#64748b;font-size:14px">No active broadcasts right now.<br><span style="font-size:12px;margin-top:8px;display:block">When an organiser goes live, their event will appear here.</span></div>`;

  return `<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Chess Broadcast</title><style>*{margin:0;padding:0;box-sizing:border-box}body{background:#0a0d12;color:#e2e8f0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;min-height:100vh}</style></head><body><div style="max-width:600px;margin:0 auto;padding:48px 24px"><div style="text-align:center;margin-bottom:40px"><h1 style="font-size:24px;font-weight:700;margin-bottom:8px">Chess Broadcast</h1><p style="color:#64748b;font-size:14px">Live tournament broadcasting with engine analysis</p></div><div style="display:flex;flex-direction:column;gap:12px">${eventList}</div></div></body></html>`;
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function buildSpectatorPage(eventId: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1">
<title>Live Broadcast</title>
<style>
*{margin:0;padding:0;box-sizing:border-box}
body{background:#0a0d12;color:#e2e8f0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif;min-height:100vh}
.header{border-bottom:1px solid rgba(255,255,255,0.06);padding:12px 24px;display:flex;align-items:center;justify-content:space-between;position:sticky;top:0;background:rgba(10,13,18,0.85);backdrop-filter:blur(12px);z-index:10}
.dot{width:10px;height:10px;border-radius:50%;display:inline-block}
.dot-live{background:#34d399;animation:pulse 2s infinite}
.dot-off{background:#ef4444}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:0.4}}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:16px;padding:24px;max-width:1400px;margin:0 auto}
.card{background:#111518;border:1px solid #1e293b;border-radius:12px;overflow:hidden;transition:border-color 0.2s}
.card:hover{border-color:#334155}
.card-head{display:flex;align-items:center;justify-content:space-between;padding:8px 12px;border-bottom:1px solid rgba(255,255,255,0.04);font-size:10px;color:#64748b;text-transform:uppercase;letter-spacing:0.05em}
.card-body{padding:12px}
.player{display:flex;align-items:center;justify-content:space-between;padding:6px 0}
.player-name{font-size:14px;font-weight:500;display:flex;align-items:center;gap:8px}
.player-sq{width:12px;height:12px;border-radius:2px;flex-shrink:0}
.clock{font-family:"SF Mono",Monaco,Consolas,monospace;font-size:12px;padding:2px 8px;border-radius:4px}
.clock-active{background:rgba(52,211,153,0.15);color:#34d399}
.clock-idle{color:#64748b}
.board-wrap{display:flex;gap:6px;margin:8px 0}
.eval-bar{width:12px;border-radius:4px;overflow:hidden;background:#1e293b;position:relative;flex-shrink:0}
.eval-white{background:#e2e8f0;position:absolute;bottom:0;left:0;right:0;transition:height 0.5s}
.eval-score{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:7px;font-weight:700;font-family:monospace;mix-blend-mode:difference;color:white}
.board{display:grid;grid-template-columns:repeat(8,1fr);border-radius:4px;overflow:hidden;aspect-ratio:1;flex:1}
.sq{display:flex;align-items:center;justify-content:center;font-size:0;user-select:none}
.sq-l{background:#f0d9b5}.sq-d{background:#b58863}
.accuracy{display:flex;align-items:center;justify-content:space-between;padding-top:8px;margin-top:8px;border-top:1px solid rgba(255,255,255,0.04);font-size:10px;color:#64748b;font-family:monospace}
.empty{text-align:center;padding:96px 24px;color:#64748b;font-size:14px}
.footer{border-top:1px solid rgba(255,255,255,0.04);padding:12px 24px;display:flex;justify-content:space-between;font-size:10px;color:#475569;font-family:monospace}
.badge{font-size:10px;font-family:monospace;color:#34d399;font-weight:600}
.result-badge{color:#fbbf24;font-weight:600;font-family:monospace;font-size:10px}
.rating{font-size:12px;color:#64748b;margin-left:4px}
</style>
</head>
<body>
<div class="header">
  <div style="display:flex;align-items:center;gap:12px">
    <span class="dot dot-off" id="statusDot"></span>
    <div>
      <div style="font-size:16px;font-weight:700" id="eventTitle">Connecting...</div>
      <div style="font-size:10px;color:#64748b;font-family:monospace" id="eventSub">${esc(eventId)}</div>
    </div>
  </div>
  <div style="display:flex;align-items:center;gap:16px;font-size:12px;color:#64748b;font-family:monospace">
    <span id="boardCount"></span>
    <span id="liveCount"></span>
  </div>
</div>
<div id="content"><div class="empty"><span class="dot dot-off" style="margin-right:8px"></span>Connecting to broadcast...</div></div>
<div class="footer"><span>Chess Broadcast</span><span id="connStatus">Disconnected</span></div>

<script>
const PIECE = {K:"\\u2654",Q:"\\u2655",R:"\\u2656",B:"\\u2657",N:"\\u2658",P:"\\u2659",k:"\\u265A",q:"\\u265B",r:"\\u265C",b:"\\u265D",n:"\\u265E",p:"\\u265F"};
const eventId = ${JSON.stringify(eventId)};
const games = new Map();
const evals = new Map();
let connected = false;
let eventName = null;
let ws;

function connect() {
  const proto = location.protocol === "https:" ? "wss:" : "ws:";
  ws = new WebSocket(proto + "//" + location.host);
  ws.onopen = () => {
    ws.send(JSON.stringify({type:"relay_subscribe",eventId}));
    connected = true;
    updateStatus();
  };
  ws.onmessage = (e) => {
    try {
      const msg = JSON.parse(e.data);
      if (msg.type === "game_update") {
        games.set(msg.board, msg.data);
        if (msg.data && msg.data.event && !eventName) {
          eventName = msg.data.event;
          document.getElementById("eventTitle").textContent = eventName;
        }
      } else if (msg.type === "eval_update") {
        evals.set(msg.board, msg.evaluation);
      }
      render();
    } catch {}
  };
  ws.onclose = () => { connected = false; updateStatus(); setTimeout(connect, 3000); };
  ws.onerror = () => { connected = false; updateStatus(); };
}

function updateStatus() {
  const dot = document.getElementById("statusDot");
  dot.className = connected ? "dot dot-live" : "dot dot-off";
  document.getElementById("connStatus").textContent = connected ? "Connected" : "Reconnecting...";
  if (!connected && games.size === 0) {
    document.getElementById("content").innerHTML = '<div class="empty"><span class="dot dot-off" style="margin-right:8px"></span>Connecting to broadcast...</div>';
  }
}

function evalToPercent(type, value) {
  if (type === "mate") return value > 0 ? 100 : 0;
  const c = Math.max(-1000, Math.min(1000, value));
  return 50 + 50 * (2 / (1 + Math.exp(-0.004 * c)) - 1);
}

function formatScore(type, value) {
  if (type === "mate") return "M" + Math.abs(value);
  return (value >= 0 ? "+" : "") + (value / 100).toFixed(1);
}

function parseFEN(fen) {
  const rows = fen.split(" ")[0].split("/");
  return rows.map(row => {
    const cells = [];
    for (const ch of row) {
      if (/\\d/.test(ch)) for (let i = 0; i < parseInt(ch); i++) cells.push(null);
      else cells.push(ch);
    }
    return cells;
  });
}

function renderBoard(fen) {
  const board = parseFEN(fen || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
  let html = "";
  for (let r = 0; r < 8; r++) {
    for (let c = 0; c < 8; c++) {
      const light = (r + c) % 2 === 0;
      const piece = board[r] && board[r][c];
      const sz = "calc((100% - 0px) / 8)";
      html += '<div class="sq ' + (light ? "sq-l" : "sq-d") + '" style="font-size:min(4vw,32px)">' + (piece ? PIECE[piece] || "" : "") + "</div>";
    }
  }
  return html;
}

function render() {
  const sorted = Array.from(games.entries()).sort((a,b) => a[0] - b[0]);
  const live = sorted.filter(([,g]) => g.status === "ongoing").length;
  const fin = sorted.filter(([,g]) => g.status === "finished").length;

  document.getElementById("boardCount").textContent = sorted.length + " board" + (sorted.length !== 1 ? "s" : "");
  document.getElementById("liveCount").textContent = live > 0 ? live + " live" : "";
  if (document.getElementById("liveCount").textContent) document.getElementById("liveCount").style.color = "#34d399";

  if (sorted.length === 0) {
    document.getElementById("content").innerHTML = '<div class="empty">' + (connected ? '<span class="dot dot-live" style="margin-right:8px"></span>Waiting for games to start...' : '<span class="dot dot-off" style="margin-right:8px"></span>Connecting...') + '</div>';
    return;
  }

  let html = '<div class="grid">';
  for (const [board, game] of sorted) {
    const ev = evals.get(board);
    const turn = game.fen ? game.fen.split(" ")[1] : "w";
    const isFinished = game.status === "finished";
    const pct = ev ? evalToPercent(ev.type, ev.value) : 50;

    html += '<div class="card">';
    // Header
    html += '<div class="card-head"><span>Board ' + board + '</span><span>';
    if (ev) html += '<span style="margin-right:8px">' + formatScore(ev.type, ev.value) + '</span>';
    if (isFinished) html += '<span class="result-badge">' + escH(game.gameResult) + '</span>';
    else html += '<span class="dot dot-live" style="width:6px;height:6px"></span>';
    html += '</span></div>';

    html += '<div class="card-body">';
    // Black player (top)
    html += '<div class="player"><div class="player-name"><div class="player-sq" style="background:#1e293b;border:1px solid #475569"></div>' + escH(game.blackInfo?.name || "Black");
    if (game.blackInfo?.rating) html += '<span class="rating">' + escH(game.blackInfo.rating) + '</span>';
    html += '</div><span class="clock ' + (!isFinished && turn === "b" ? "clock-active" : "clock-idle") + '">' + escH(game.blackClock || "--:--") + '</span></div>';

    // Board + eval
    html += '<div class="board-wrap">';
    html += '<div class="eval-bar"><div class="eval-white" style="height:' + pct + '%"></div>';
    if (ev) html += '<div class="eval-score">' + formatScore(ev.type, ev.value) + '</div>';
    html += '</div>';
    html += '<div class="board">' + renderBoard(game.fen) + '</div>';
    html += '</div>';

    // White player (bottom)
    html += '<div class="player"><div class="player-name"><div class="player-sq" style="background:#e2e8f0;border:1px solid #cbd5e1"></div>' + escH(game.whiteInfo?.name || "White");
    if (game.whiteInfo?.rating) html += '<span class="rating">' + escH(game.whiteInfo.rating) + '</span>';
    html += '</div><span class="clock ' + (!isFinished && turn === "w" ? "clock-active" : "clock-idle") + '">' + escH(game.whiteClock || "--:--") + '</span></div>';

    // Accuracy
    if (ev && ev.whiteAccuracy != null) {
      html += '<div class="accuracy"><span>Accuracy</span><span>' + ev.whiteAccuracy + '% | ' + ev.blackAccuracy + '%</span></div>';
    }

    // Move count
    const mc = game.moveCount || 0;
    html += '<div style="font-size:10px;color:#475569;font-family:monospace;margin-top:4px">' + (mc > 0 ? "Move " + Math.ceil(mc/2) : "Starting...") + '</div>';

    html += '</div></div>';
  }
  html += '</div>';
  document.getElementById("content").innerHTML = html;
}

function escH(s) { return (s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

connect();
<\/script>
</body>
</html>`;
}

server.listen(PORT, () => {
  console.log(`[relay] Chess Broadcast Relay running on :${PORT}`);
  console.log(`[relay] Health: http://localhost:${PORT}/health`);
  console.log(`[relay] Events: http://localhost:${PORT}/events`);
});
