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
  // Health check
  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({
      ok: true,
      rooms: rooms.size,
      spectators: Array.from(rooms.values()).reduce((sum, r) => sum + r.spectators.size, 0),
    }));
    return;
  }

  // List active events
  if (req.url === "/events") {
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

server.listen(PORT, () => {
  console.log(`[relay] Chess Broadcast Relay running on :${PORT}`);
  console.log(`[relay] Health: http://localhost:${PORT}/health`);
  console.log(`[relay] Events: http://localhost:${PORT}/events`);
});
