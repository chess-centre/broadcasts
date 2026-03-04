/**
 * Mock Chess Game Data
 * Sample players, openings, and game scenarios for testing
 */

const players = [
  { name: "Magnus Carlsen", rating: "2882" },
  { name: "Fabiano Caruana", rating: "2804" },
  { name: "Ding Liren", rating: "2799" },
  { name: "Ian Nepomniachtchi", rating: "2795" },
  { name: "Hikaru Nakamura", rating: "2789" },
  { name: "Wesley So", rating: "2773" },
  { name: "Levon Aronian", rating: "2765" },
  { name: "Anish Giri", rating: "2760" },
  { name: "Maxime Vachier-Lagrave", rating: "2751" },
  { name: "Shakhriyar Mamedyarov", rating: "2748" },
  { name: "Viswanathan Anand", rating: "2745" },
  { name: "Alexander Grischuk", rating: "2742" },
  { name: "Teimour Radjabov", rating: "2738" },
  { name: "Richard Rapport", rating: "2735" },
  { name: "Alireza Firouzja", rating: "2730" },
  { name: "Vladislav Artemiev", rating: "2725" },
  { name: "Jan-Krzysztof Duda", rating: "2720" },
  { name: "Yu Yangyi", rating: "2715" },
  { name: "Pentala Harikrishna", rating: "2710" },
  { name: "Sergey Karjakin", rating: "2705" },
];

const openings = [
  {
    name: "Ruy Lopez",
    moves: "1. e4 e5 2. Nf3 Nc6 3. Bb5",
    continuation: [
      "3... a6 4. Ba4 Nf6 5. O-O Be7",
      "3... Nf6 4. O-O Nxe4 5. d4",
    ],
  },
  {
    name: "Sicilian Defense",
    moves: "1. e4 c5 2. Nf3 d6 3. d4 cxd4 4. Nxd4",
    continuation: ["4... Nf6 5. Nc3 a6", "4... Nf6 5. Nc3 g6"],
  },
  {
    name: "Queen's Gambit",
    moves: "1. d4 d5 2. c4",
    continuation: ["2... dxc4 3. Nf3 Nf6 4. e3", "2... e6 3. Nc3 Nf6 4. Bg5"],
  },
  {
    name: "King's Indian Defense",
    moves: "1. d4 Nf6 2. c4 g6 3. Nc3 Bg7 4. e4 d6",
    continuation: ["5. Nf3 O-O 6. Be2 e5", "5. f3 O-O 6. Be3 e5"],
  },
  {
    name: "French Defense",
    moves: "1. e4 e6 2. d4 d5",
    continuation: ["3. Nc3 Bb4 4. e5 c5", "3. Nd2 c5 4. exd5 exd5"],
  },
  {
    name: "Caro-Kann Defense",
    moves: "1. e4 c6 2. d4 d5 3. Nc3",
    continuation: ["3... dxe4 4. Nxe4 Bf5", "3... dxe4 4. Nxe4 Nd7"],
  },
  {
    name: "English Opening",
    moves: "1. c4 e5 2. Nc3 Nf6 3. Nf3",
    continuation: ["3... Nc6 4. g3 d5", "3... Nc6 4. e4 Bc5"],
  },
  {
    name: "Italian Game",
    moves: "1. e4 e5 2. Nf3 Nc6 3. Bc4 Bc5",
    continuation: ["4. c3 Nf6 5. d4 exd4", "4. b4 Bb6 5. a4 a6"],
  },
];

const middlegameMoves = [
  "Rb1",
  "Qd2",
  "Rad1",
  "Rfd1",
  "Rac1",
  "Rfc1",
  "h3",
  "a3",
  "b4",
  "a4",
  "Qe2",
  "Qc2",
  "Nd2",
  "Ne1",
  "Bg5",
  "Bf4",
  "Be3",
  "Bd2",
  "Nh4",
  "Ng5",
];

const timeControls = [
  { initial: "01:30:00", increment: 30 }, // Classical
  { initial: "00:45:00", increment: 15 }, // Rapid
  { initial: "00:25:00", increment: 10 }, // Rapid
  { initial: "00:15:00", increment: 5 }, // Blitz
  { initial: "00:03:00", increment: 2 }, // Blitz
];

/**
 * Generate a random player pairing
 */
function generatePairing(usedPlayers = []) {
  const availablePlayers = players.filter((p) => !usedPlayers.includes(p));

  if (availablePlayers.length < 2) {
    // Reset if we run out
    return {
      white: players[Math.floor(Math.random() * players.length)],
      black: players[Math.floor(Math.random() * players.length)],
    };
  }

  const white =
    availablePlayers[Math.floor(Math.random() * availablePlayers.length)];
  const remainingPlayers = availablePlayers.filter((p) => p !== white);
  const black =
    remainingPlayers[Math.floor(Math.random() * remainingPlayers.length)];

  return { white, black };
}

/**
 * Generate a random opening with continuation
 */
function generateOpening() {
  const opening = openings[Math.floor(Math.random() * openings.length)];
  const continuation =
    opening.continuation[
      Math.floor(Math.random() * opening.continuation.length)
    ];
  return {
    name: opening.name,
    moves: opening.moves + " " + continuation,
  };
}

/**
 * Generate random middlegame moves
 */
function generateMiddlegameMoves(count = 10) {
  const moves = [];
  for (let i = 0; i < count; i++) {
    const isWhite = i % 2 === 0;
    const move =
      middlegameMoves[Math.floor(Math.random() * middlegameMoves.length)];
    moves.push(move);
  }
  return moves;
}

/**
 * Convert time string to seconds
 */
function timeToSeconds(timeStr) {
  const parts = timeStr.split(":");
  return (
    parseInt(parts[0]) * 3600 + parseInt(parts[1]) * 60 + parseInt(parts[2])
  );
}

/**
 * Convert seconds to time string
 */
function secondsToTime(seconds) {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
}

/**
 * Get random time control
 */
function getTimeControl() {
  return timeControls[Math.floor(Math.random() * timeControls.length)];
}

/**
 * Generate random game result
 */
function getRandomResult() {
  const rand = Math.random();
  if (rand < 0.4) return "1-0"; // White wins
  if (rand < 0.8) return "0-1"; // Black wins
  return "1/2-1/2"; // Draw
}

module.exports = {
  players,
  openings,
  middlegameMoves,
  timeControls,
  generatePairing,
  generateOpening,
  generateMiddlegameMoves,
  timeToSeconds,
  secondsToTime,
  getTimeControl,
  getRandomResult,
};
