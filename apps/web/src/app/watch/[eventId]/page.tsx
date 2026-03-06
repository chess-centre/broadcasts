"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

const RELAY_URL = process.env.NEXT_PUBLIC_RELAY_URL || "ws://localhost:3001";

interface GameState {
  gameResult: string;
  whiteInfo: { name: string; rating: string };
  blackInfo: { name: string; rating: string };
  whiteClock: string;
  blackClock: string;
  fen?: string;
  moveCount: number;
  pgn: string;
  status: string;
}

export default function WatchPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const [connected, setConnected] = useState(false);
  const [games, setGames] = useState<Map<number, GameState>>(new Map());
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!eventId) return;

    const ws = new WebSocket(RELAY_URL);
    wsRef.current = ws;

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "relay_subscribe", eventId }));
      setConnected(true);
    };

    ws.onmessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.type === "game_update") {
          setGames((prev) => {
            const next = new Map(prev);
            next.set(msg.board, msg.data);
            return next;
          });
        }
      } catch {
        // ignore parse errors
      }
    };

    ws.onclose = () => setConnected(false);
    ws.onerror = () => setConnected(false);

    return () => {
      ws.close();
    };
  }, [eventId]);

  const sortedGames = Array.from(games.entries()).sort(
    ([a], [b]) => a - b
  );

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              connected
                ? "bg-[var(--green)] animate-pulse"
                : "bg-red-500"
            }`}
          />
          <h1 className="text-2xl font-bold font-mono">
            Live Broadcast
          </h1>
          <span className="text-sm text-[var(--text-dim)] ml-auto">
            {sortedGames.length} board{sortedGames.length !== 1 ? "s" : ""} &middot;{" "}
            {sortedGames.filter(([, g]) => g.status === "ongoing").length} live
          </span>
        </div>

        {/* Boards grid */}
        {sortedGames.length === 0 ? (
          <div className="text-center py-24 text-[var(--text-dim)]">
            {connected
              ? "Waiting for games to start..."
              : "Connecting to broadcast..."}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sortedGames.map(([board, game]) => (
              <div
                key={board}
                className="bg-[var(--bg-card)] border border-[var(--border)] rounded-xl p-4"
              >
                <div className="flex justify-between items-center text-sm mb-3">
                  <span className="font-medium">
                    {game.whiteInfo.name}
                    {game.whiteInfo.rating && (
                      <span className="text-[var(--text-dim)] ml-1 text-xs">
                        {game.whiteInfo.rating}
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-xs text-[var(--green)]">
                    {game.whiteClock}
                  </span>
                </div>

                {/* Board placeholder — @broadcasts/ui Board component goes here */}
                <div className="aspect-square bg-[var(--bg-elevated)] rounded-lg mb-3 flex items-center justify-center text-[var(--text-dim)] text-xs font-mono">
                  Board {board}
                  {game.status === "finished" && (
                    <span className="ml-2 text-[var(--green)]">
                      {game.gameResult}
                    </span>
                  )}
                </div>

                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium">
                    {game.blackInfo.name}
                    {game.blackInfo.rating && (
                      <span className="text-[var(--text-dim)] ml-1 text-xs">
                        {game.blackInfo.rating}
                      </span>
                    )}
                  </span>
                  <span className="font-mono text-xs text-[var(--green)]">
                    {game.blackClock}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
