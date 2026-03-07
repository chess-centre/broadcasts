// ── Player & Game Types ──

export interface PlayerInfo {
  name: string;
  rating: string;
}

export interface GameState {
  gameResult: string;
  whiteInfo: PlayerInfo;
  blackInfo: PlayerInfo;
  whiteClock: string;
  blackClock: string;
  fen?: string;
  event?: string;
  round?: string;
  date?: string;
  moveCount: number;
  currentMove?: number;
  pgn: string;
  status: "waiting" | "ongoing" | "finished" | "error";
  error?: string;
}

export interface EvalResult {
  type: "cp" | "mate";
  value: number;
  lines?: EvalLine[];
  whiteAccuracy?: number;
  blackAccuracy?: number;
  whiteACPL?: number;
  blackACPL?: number;
}

export interface EvalLine {
  pv: string[];
  depth: number;
  score: { type: "cp" | "mate"; value: number };
  rank: number;
}

// ── WebSocket Messages: Client → Server ──

export interface SubscribeRoundMessage {
  type: "subscribe_round";
  round: number;
}

export interface PingMessage {
  type: "ping";
}

export type ClientMessage = SubscribeRoundMessage | PingMessage;

// ── WebSocket Messages: Server → Client ──

export interface ConnectedMessage {
  type: "connected";
  message: string;
  timestamp: string;
}

export interface SubscribedMessage {
  type: "subscribed";
  round: number;
  message: string;
}

export interface GameUpdateMessage {
  type: "game_update";
  round: number;
  board: number;
  data: GameState;
  timestamp: string;
}

export interface EvalUpdateMessage {
  type: "eval_update";
  board: number;
  evaluation: EvalResult;
  fen: string;
}

export interface PongMessage {
  type: "pong";
}

export type ServerMessage =
  | ConnectedMessage
  | SubscribedMessage
  | GameUpdateMessage
  | EvalUpdateMessage
  | PongMessage;

// ── Relay Messages: Desktop → Relay ──

export interface RelayAuthMessage {
  type: "relay_auth";
  eventId: string;
  secret: string;
  eventName?: string;
}

export interface RelayPublishMessage {
  type: "relay_publish";
  eventId: string;
  message: ServerMessage;
}

export type RelayUpstreamMessage = RelayAuthMessage | RelayPublishMessage;

// ── Relay Messages: Spectator → Relay ──

export interface RelaySubscribeMessage {
  type: "relay_subscribe";
  eventId: string;
}

export type RelayDownstreamMessage = RelaySubscribeMessage | PingMessage;

// ── Event Metadata ──

export interface EventInfo {
  id: string;
  name: string;
  venue?: string;
  date: string;
  rounds: number;
  boards: number;
  format: "round-robin" | "swiss" | "congress";
  timeControl?: string;
  createdAt: string;
}

// ── Config ──

export const DEFAULT_SERVER_PORT = 8080;
export const DEFAULT_RELAY_PORT = 3001;
export const WEBSOCKET_PATH = "/games";
export const RELAY_WEBSOCKET_PATH = "/relay";
