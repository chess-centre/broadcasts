/**
 * Download all game PGNs as a single file.
 */
export function downloadAllPgn(games, eventName = "Broadcast") {
  const allPgn = Array.from(games.values())
    .map((g) => g.pgn)
    .filter(Boolean)
    .join("\n\n");

  if (!allPgn) return;

  const blob = new Blob([allPgn], { type: "application/x-chess-pgn" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${eventName.replace(/\s+/g, "_")}.pgn`;
  a.click();
  URL.revokeObjectURL(url);
}

/**
 * Download a single game PGN.
 */
export function downloadSinglePgn(pgn, whitePlayer, blackPlayer) {
  if (!pgn) return;

  const blob = new Blob([pgn], { type: "application/x-chess-pgn" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${(whitePlayer || "White").replace(/\s+/g, "_")}_vs_${(blackPlayer || "Black").replace(/\s+/g, "_")}.pgn`;
  a.click();
  URL.revokeObjectURL(url);
}
