/**
 * Lightweight ECO opening lookup.
 * Each entry: { moves (SAN tokens space-separated), eco, name }
 * Sorted by move count descending so longest-prefix-match wins.
 */
const OPENINGS = [
  // Sicilian variations (B20-B99)
  { moves: "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 a6", eco: "B90", name: "Sicilian Najdorf" },
  { moves: "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 g6", eco: "B76", name: "Sicilian Dragon" },
  { moves: "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 e5", eco: "B56", name: "Sicilian Classical" },
  { moves: "e4 c5 Nf3 d6 d4 cxd4 Nxd4 Nf6 Nc3 Nc6", eco: "B56", name: "Sicilian Classical" },
  { moves: "e4 c5 Nf3 e6 d4 cxd4 Nxd4 Nc6", eco: "B45", name: "Sicilian Taimanov" },
  { moves: "e4 c5 Nf3 e6 d4 cxd4 Nxd4 a6", eco: "B44", name: "Sicilian Kan" },
  { moves: "e4 c5 Nf3 Nc6 d4 cxd4 Nxd4", eco: "B30", name: "Sicilian Open" },
  { moves: "e4 c5 Nc3 Nc6 g3", eco: "B23", name: "Sicilian Closed" },
  { moves: "e4 c5 Nf3 d6 d4", eco: "B50", name: "Sicilian Open" },
  { moves: "e4 c5 Nf3 Nc6", eco: "B30", name: "Sicilian Defense" },
  { moves: "e4 c5 Nf3 e6", eco: "B40", name: "Sicilian Defense" },
  { moves: "e4 c5 Nf3 d6", eco: "B50", name: "Sicilian Defense" },
  { moves: "e4 c5 c3", eco: "B22", name: "Sicilian Alapin" },
  { moves: "e4 c5", eco: "B20", name: "Sicilian Defense" },

  // Ruy Lopez (C60-C99)
  { moves: "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Be7", eco: "C84", name: "Ruy Lopez Closed" },
  { moves: "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6 O-O Nxe4", eco: "C81", name: "Ruy Lopez Open" },
  { moves: "e4 e5 Nf3 Nc6 Bb5 Nf6", eco: "C65", name: "Ruy Lopez Berlin" },
  { moves: "e4 e5 Nf3 Nc6 Bb5 a6 Ba4 Nf6", eco: "C80", name: "Ruy Lopez Morphy" },
  { moves: "e4 e5 Nf3 Nc6 Bb5 f5", eco: "C63", name: "Ruy Lopez Schliemann" },
  { moves: "e4 e5 Nf3 Nc6 Bb5 a6 Ba4", eco: "C70", name: "Ruy Lopez Morphy" },
  { moves: "e4 e5 Nf3 Nc6 Bb5 a6", eco: "C68", name: "Ruy Lopez Exchange" },
  { moves: "e4 e5 Nf3 Nc6 Bb5", eco: "C60", name: "Ruy Lopez" },

  // Italian Game (C50-C59)
  { moves: "e4 e5 Nf3 Nc6 Bc4 Bc5 c3 Nf6 d4", eco: "C54", name: "Italian Giuoco Piano" },
  { moves: "e4 e5 Nf3 Nc6 Bc4 Nf6 d4", eco: "C55", name: "Italian Two Knights" },
  { moves: "e4 e5 Nf3 Nc6 Bc4 Bc5", eco: "C50", name: "Italian Giuoco Piano" },
  { moves: "e4 e5 Nf3 Nc6 Bc4 Nf6", eco: "C55", name: "Italian Two Knights" },
  { moves: "e4 e5 Nf3 Nc6 Bc4", eco: "C50", name: "Italian Game" },

  // Scotch (C45)
  { moves: "e4 e5 Nf3 Nc6 d4 exd4 Nxd4", eco: "C45", name: "Scotch Game" },
  { moves: "e4 e5 Nf3 Nc6 d4", eco: "C44", name: "Scotch Game" },

  // Petrov (C42)
  { moves: "e4 e5 Nf3 Nf6 Nxe5 d6", eco: "C42", name: "Petrov Defense" },
  { moves: "e4 e5 Nf3 Nf6", eco: "C42", name: "Petrov Defense" },

  // King's Gambit (C30)
  { moves: "e4 e5 f4 exf4", eco: "C33", name: "King's Gambit Accepted" },
  { moves: "e4 e5 f4", eco: "C30", name: "King's Gambit" },

  // French Defense (C00-C19)
  { moves: "e4 e6 d4 d5 Nc3 Bb4", eco: "C15", name: "French Winawer" },
  { moves: "e4 e6 d4 d5 Nc3 Nf6", eco: "C10", name: "French Classical" },
  { moves: "e4 e6 d4 d5 Nd2", eco: "C01", name: "French Tarrasch" },
  { moves: "e4 e6 d4 d5 e5", eco: "C02", name: "French Advance" },
  { moves: "e4 e6 d4 d5 exd5 exd5", eco: "C01", name: "French Exchange" },
  { moves: "e4 e6 d4 d5 Nc3", eco: "C10", name: "French Defense" },
  { moves: "e4 e6 d4 d5", eco: "C00", name: "French Defense" },
  { moves: "e4 e6", eco: "C00", name: "French Defense" },

  // Caro-Kann (B10-B19)
  { moves: "e4 c6 d4 d5 Nc3 dxe4 Nxe4 Bf5", eco: "B18", name: "Caro-Kann Classical" },
  { moves: "e4 c6 d4 d5 e5", eco: "B12", name: "Caro-Kann Advance" },
  { moves: "e4 c6 d4 d5 exd5 cxd5", eco: "B13", name: "Caro-Kann Exchange" },
  { moves: "e4 c6 d4 d5 Nc3", eco: "B15", name: "Caro-Kann" },
  { moves: "e4 c6 d4 d5", eco: "B12", name: "Caro-Kann" },
  { moves: "e4 c6", eco: "B10", name: "Caro-Kann" },

  // Pirc/Modern (B07-B09)
  { moves: "e4 d6 d4 Nf6 Nc3 g6", eco: "B07", name: "Pirc Defense" },
  { moves: "e4 g6 d4 Bg7", eco: "B06", name: "Modern Defense" },

  // Scandinavian (B01)
  { moves: "e4 d5 exd5 Qxd5", eco: "B01", name: "Scandinavian Defense" },
  { moves: "e4 d5", eco: "B01", name: "Scandinavian Defense" },

  // Queen's Gambit (D06-D69)
  { moves: "d4 d5 c4 e6 Nc3 Nf6 Bg5", eco: "D50", name: "QGD Classical" },
  { moves: "d4 d5 c4 e6 Nc3 Nf6 Nf3", eco: "D37", name: "Queen's Gambit Declined" },
  { moves: "d4 d5 c4 dxc4 Nf3 Nf6", eco: "D20", name: "Queen's Gambit Accepted" },
  { moves: "d4 d5 c4 e6 Nc3 Nf6", eco: "D35", name: "Queen's Gambit Declined" },
  { moves: "d4 d5 c4 c6", eco: "D10", name: "Slav Defense" },
  { moves: "d4 d5 c4 dxc4", eco: "D20", name: "Queen's Gambit Accepted" },
  { moves: "d4 d5 c4 e6", eco: "D30", name: "Queen's Gambit Declined" },
  { moves: "d4 d5 c4", eco: "D06", name: "Queen's Gambit" },

  // Slav (D10-D19)
  { moves: "d4 d5 c4 c6 Nf3 Nf6 Nc3 dxc4", eco: "D15", name: "Slav Defense" },
  { moves: "d4 d5 c4 c6 Nf3 Nf6", eco: "D11", name: "Slav Defense" },

  // King's Indian (E60-E99)
  { moves: "d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 Nf3 O-O", eco: "E90", name: "King's Indian Classical" },
  { moves: "d4 Nf6 c4 g6 Nc3 Bg7 e4 d6 f3", eco: "E81", name: "King's Indian Samisch" },
  { moves: "d4 Nf6 c4 g6 Nc3 Bg7 e4 d6", eco: "E70", name: "King's Indian Defense" },
  { moves: "d4 Nf6 c4 g6 Nc3 Bg7", eco: "E60", name: "King's Indian Defense" },

  // Nimzo-Indian (E20-E59)
  { moves: "d4 Nf6 c4 e6 Nc3 Bb4 e3", eco: "E40", name: "Nimzo-Indian Rubinstein" },
  { moves: "d4 Nf6 c4 e6 Nc3 Bb4 Qc2", eco: "E32", name: "Nimzo-Indian Classical" },
  { moves: "d4 Nf6 c4 e6 Nc3 Bb4", eco: "E20", name: "Nimzo-Indian Defense" },

  // Queen's Indian (E12-E19)
  { moves: "d4 Nf6 c4 e6 Nf3 b6", eco: "E12", name: "Queen's Indian Defense" },

  // Bogo-Indian (E11)
  { moves: "d4 Nf6 c4 e6 Nf3 Bb4+", eco: "E11", name: "Bogo-Indian Defense" },

  // Catalan (E01-E09)
  { moves: "d4 Nf6 c4 e6 g3 d5 Bg2", eco: "E06", name: "Catalan Opening" },
  { moves: "d4 Nf6 c4 e6 g3", eco: "E01", name: "Catalan Opening" },

  // Grunfeld (D70-D99)
  { moves: "d4 Nf6 c4 g6 Nc3 d5 cxd5 Nxd5", eco: "D85", name: "Grunfeld Exchange" },
  { moves: "d4 Nf6 c4 g6 Nc3 d5", eco: "D70", name: "Grunfeld Defense" },

  // Benoni/Modern Benoni (A60-A79)
  { moves: "d4 Nf6 c4 c5 d5 e6", eco: "A60", name: "Modern Benoni" },

  // Dutch Defense (A80-A99)
  { moves: "d4 f5 g3 Nf6 Bg2", eco: "A81", name: "Dutch Leningrad" },
  { moves: "d4 f5", eco: "A80", name: "Dutch Defense" },

  // English Opening (A10-A39)
  { moves: "c4 e5 Nc3 Nf6", eco: "A28", name: "English Four Knights" },
  { moves: "c4 c5 Nc3 Nc6", eco: "A33", name: "English Symmetrical" },
  { moves: "c4 e5 Nc3", eco: "A25", name: "English Opening" },
  { moves: "c4 Nf6 Nc3", eco: "A15", name: "English Opening" },
  { moves: "c4 e5", eco: "A20", name: "English Opening" },
  { moves: "c4 c5", eco: "A30", name: "English Symmetrical" },
  { moves: "c4", eco: "A10", name: "English Opening" },

  // Reti (A04-A09)
  { moves: "Nf3 d5 g3 c5", eco: "A09", name: "Reti Opening" },
  { moves: "Nf3 d5 c4", eco: "A09", name: "Reti Opening" },
  { moves: "Nf3 d5", eco: "A04", name: "Reti Opening" },

  // London System
  { moves: "d4 d5 Bf4", eco: "D00", name: "London System" },
  { moves: "d4 Nf6 Bf4", eco: "D00", name: "London System" },

  // Trompowsky
  { moves: "d4 Nf6 Bg5", eco: "A45", name: "Trompowsky Attack" },

  // Vienna (C25-C29)
  { moves: "e4 e5 Nc3 Nf6", eco: "C27", name: "Vienna Game" },
  { moves: "e4 e5 Nc3", eco: "C25", name: "Vienna Game" },

  // Bird
  { moves: "f4", eco: "A02", name: "Bird's Opening" },

  // Generic fallbacks
  { moves: "e4 e5 Nf3 Nc6", eco: "C44", name: "King's Pawn Game" },
  { moves: "e4 e5 Nf3", eco: "C40", name: "King's Pawn Game" },
  { moves: "e4 e5", eco: "C20", name: "King's Pawn Game" },
  { moves: "d4 d5", eco: "D00", name: "Queen's Pawn Game" },
  { moves: "d4 Nf6 c4 e6 Nf3", eco: "E10", name: "Indian Defense" },
  { moves: "d4 Nf6 c4", eco: "A50", name: "Indian Defense" },
  { moves: "d4 Nf6", eco: "A45", name: "Indian Defense" },
  { moves: "e4", eco: "B00", name: "King's Pawn" },
  { moves: "d4", eco: "A40", name: "Queen's Pawn" },
].sort((a, b) => b.moves.split(" ").length - a.moves.split(" ").length);

/**
 * Find the longest matching opening for a list of SAN moves.
 * @param {string[]} movesSan - Array of SAN move strings, e.g. ["e4", "e5", "Nf3"]
 * @returns {{ eco: string, name: string } | null}
 */
export function detectOpening(movesSan) {
  if (!movesSan || movesSan.length === 0) return null;
  const joined = movesSan.join(" ");

  for (const opening of OPENINGS) {
    if (joined.startsWith(opening.moves) &&
        (joined.length === opening.moves.length || joined[opening.moves.length] === " ")) {
      return { eco: opening.eco, name: opening.name };
    }
  }
  return null;
}
