"use client";

import { useParams } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";

const RELAY_URL = process.env.NEXT_PUBLIC_RELAY_URL || "ws://localhost:3001";

// --- Types ---

interface PlayerInfo {
  name: string;
  rating: string;
}

interface GameState {
  gameResult: string;
  whiteInfo: PlayerInfo;
  blackInfo: PlayerInfo;
  whiteClock: string;
  blackClock: string;
  fen?: string;
  moveCount: number;
  pgn: string;
  status: string;
  event?: string;
  round?: string;
}

interface EvalData {
  type: "cp" | "mate";
  value: number;
  whiteAccuracy?: number;
  blackAccuracy?: number;
  lines?: { pv: string[]; depth: number; score: { type: string; value: number }; rank: number }[];
}

// --- FEN Board Renderer ---

const PIECE_UNICODE: Record<string, string> = {
  K: "\u2654", Q: "\u2655", R: "\u2656", B: "\u2657", N: "\u2658", P: "\u2659",
  k: "\u265A", q: "\u265B", r: "\u265C", b: "\u265D", n: "\u265E", p: "\u265F",
};

function parseFEN(fen: string): (string | null)[][] {
  const rows = fen.split(" ")[0].split("/");
  return rows.map((row) => {
    const cells: (string | null)[] = [];
    for (const ch of row) {
      if (/\d/.test(ch)) {
        for (let i = 0; i < parseInt(ch); i++) cells.push(null);
      } else {
        cells.push(ch);
      }
    }
    return cells;
  });
}

function MiniBoard({ fen, size = 280 }: { fen?: string; size?: number }) {
  const board = parseFEN(fen || "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR");
  const sq = size / 8;
  const light = "#f0d9b5";
  const dark = "#b58863";

  return (
    <div
      className="rounded overflow-hidden"
      style={{ width: size, height: size, display: "grid", gridTemplateColumns: `repeat(8, ${sq}px)`, gridTemplateRows: `repeat(8, ${sq}px)` }}
    >
      {board.flatMap((row, r) =>
        row.map((piece, c) => {
          const isLight = (r + c) % 2 === 0;
          return (
            <div
              key={`${r}-${c}`}
              style={{
                width: sq,
                height: sq,
                background: isLight ? light : dark,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: sq * 0.75,
                lineHeight: 1,
                userSelect: "none",
              }}
            >
              {piece ? PIECE_UNICODE[piece] : null}
            </div>
          );
        })
      )}
    </div>
  );
}

// --- Eval Bar ---

function evalToPercent(type: string, value: number): number {
  if (type === "mate") return value > 0 ? 100 : 0;
  const clamped = Math.max(-1000, Math.min(1000, value));
  return 50 + 50 * (2 / (1 + Math.exp(-0.004 * clamped)) - 1);
}

function formatScore(type: string, value: number): string {
  if (type === "mate") return `M${Math.abs(value)}`;
  return (value >= 0 ? "+" : "") + (value / 100).toFixed(1);
}

function EvalBar({ evaluation }: { evaluation?: EvalData }) {
  const pct = evaluation ? evalToPercent(evaluation.type, evaluation.value) : 50;

  return (
    <div className="w-3 rounded-sm overflow-hidden bg-zinc-800 relative flex flex-col" style={{ height: "100%" }}>
      {/* Black portion (top) */}
      <div
        className="bg-zinc-800 transition-all duration-500"
        style={{ height: `${100 - pct}%` }}
      />
      {/* White portion (bottom) */}
      <div
        className="bg-white transition-all duration-500"
        style={{ height: `${pct}%` }}
      />
      {evaluation && (
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center">
          <span className="text-[7px] font-mono font-bold leading-none mix-blend-difference text-white">
            {formatScore(evaluation.type, evaluation.value)}
          </span>
        </div>
      )}
    </div>
  );
}

// --- Player Row ---

function PlayerRow({ info, clock, color, isActive }: {
  info: PlayerInfo;
  clock: string;
  color: "white" | "black";
  isActive?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2 py-1.5">
      <div className="flex items-center gap-2 min-w-0">
        <div
          className={`w-3 h-3 rounded-sm shrink-0 ${
            color === "white" ? "bg-white border border-zinc-300" : "bg-zinc-900 border border-zinc-600"
          }`}
        />
        <span className="text-sm font-medium truncate">{info.name}</span>
        {info.rating && (
          <span className="text-xs text-zinc-500 shrink-0">{info.rating}</span>
        )}
      </div>
      <span
        className={`font-mono text-xs tabular-nums shrink-0 px-2 py-0.5 rounded ${
          isActive ? "bg-emerald-500/20 text-emerald-400" : "text-zinc-500"
        }`}
      >
        {clock || "--:--"}
      </span>
    </div>
  );
}

// --- Game Card ---

function GameCard({ board, game, evaluation }: {
  board: number;
  game: GameState;
  evaluation?: EvalData;
}) {
  const isFinished = game.status === "finished";
  const turn = game.fen?.split(" ")[1];

  return (
    <div className="bg-[#111518] border border-zinc-800 rounded-xl overflow-hidden hover:border-zinc-700 transition-colors">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-zinc-800/50">
        <span className="text-[10px] text-zinc-500 font-mono uppercase tracking-wider">Board {board}</span>
        <div className="flex items-center gap-2">
          {evaluation && (
            <span className="text-[10px] font-mono text-zinc-400">
              {formatScore(evaluation.type, evaluation.value)}
            </span>
          )}
          {isFinished ? (
            <span className="text-[10px] font-mono text-amber-400 font-medium">{game.gameResult}</span>
          ) : (
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          )}
        </div>
      </div>

      <div className="p-3">
        {/* Black player (top) */}
        <PlayerRow info={game.blackInfo} clock={game.blackClock} color="black" isActive={!isFinished && turn === "b"} />

        {/* Board + eval bar */}
        <div className="flex gap-1.5 my-2">
          <EvalBar evaluation={evaluation} />
          <MiniBoard fen={game.fen} size={260} />
        </div>

        {/* White player (bottom) */}
        <PlayerRow info={game.whiteInfo} clock={game.whiteClock} color="white" isActive={!isFinished && turn === "w"} />

        {/* Accuracy row */}
        {evaluation?.whiteAccuracy != null && (
          <div className="flex items-center justify-between mt-2 pt-2 border-t border-zinc-800/50">
            <span className="text-[10px] text-zinc-500">Accuracy</span>
            <div className="flex items-center gap-3 text-[10px] font-mono">
              <span className="text-zinc-300">{evaluation.whiteAccuracy}%</span>
              <span className="text-zinc-600">|</span>
              <span className="text-zinc-300">{evaluation.blackAccuracy}%</span>
            </div>
          </div>
        )}

        {/* Move count */}
        <div className="flex items-center justify-between mt-1">
          <span className="text-[10px] text-zinc-600 font-mono">
            {game.moveCount > 0 ? `Move ${Math.ceil(game.moveCount / 2)}` : "Starting..."}
          </span>
          {game.event && (
            <span className="text-[10px] text-zinc-600 truncate max-w-[150px]">
              {game.round ? `Rd ${game.round}` : ""}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Main Page ---

export default function WatchPage() {
  const { eventId } = useParams<{ eventId: string }>();
  const [connected, setConnected] = useState(false);
  const [games, setGames] = useState<Map<number, GameState>>(new Map());
  const [evals, setEvals] = useState<Map<number, EvalData>>(new Map());
  const [eventName, setEventName] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const connect = useCallback(() => {
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
          if (msg.data?.event && !eventName) {
            setEventName(msg.data.event);
          }
        } else if (msg.type === "eval_update") {
          setEvals((prev) => {
            const next = new Map(prev);
            next.set(msg.board, msg.evaluation);
            return next;
          });
        }
      } catch {
        // ignore parse errors
      }
    };

    ws.onclose = () => {
      setConnected(false);
      // Auto-reconnect after 3 seconds
      reconnectRef.current = setTimeout(connect, 3000);
    };

    ws.onerror = () => {
      setConnected(false);
    };
  }, [eventId, eventName]);

  useEffect(() => {
    connect();
    return () => {
      if (reconnectRef.current) clearTimeout(reconnectRef.current);
      wsRef.current?.close();
    };
  }, [connect]);

  const sortedGames = Array.from(games.entries()).sort(([a], [b]) => a - b);
  const liveCount = sortedGames.filter(([, g]) => g.status === "ongoing").length;
  const finishedCount = sortedGames.filter(([, g]) => g.status === "finished").length;

  return (
    <main className="min-h-screen bg-[#0a0d12]">
      {/* Header */}
      <header className="border-b border-zinc-800/50 bg-[#0a0d12]/80 backdrop-blur-md sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                connected ? "bg-emerald-400 animate-pulse" : "bg-red-500"
              }`}
            />
            <div>
              <h1 className="text-base font-bold font-mono text-white">
                {eventName || "Live Broadcast"}
              </h1>
              <p className="text-[10px] text-zinc-500 font-mono">{eventId}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-zinc-500 font-mono">
            {sortedGames.length > 0 && (
              <>
                <span>{sortedGames.length} board{sortedGames.length !== 1 ? "s" : ""}</span>
                {liveCount > 0 && <span className="text-emerald-400">{liveCount} live</span>}
                {finishedCount > 0 && <span>{finishedCount} finished</span>}
              </>
            )}
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {sortedGames.length === 0 ? (
          <div className="text-center py-24">
            <div className="inline-flex items-center gap-2 text-zinc-500 text-sm font-mono">
              {connected ? (
                <>
                  <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  Waiting for games to start...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Connecting to broadcast...
                </>
              )}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {sortedGames.map(([board, game]) => (
              <GameCard
                key={board}
                board={board}
                game={game}
                evaluation={evals.get(board)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800/50 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between text-[10px] text-zinc-600 font-mono">
          <span>Chess Broadcast</span>
          <span>{connected ? "Connected to relay" : "Disconnected"}</span>
        </div>
      </footer>
    </main>
  );
}
