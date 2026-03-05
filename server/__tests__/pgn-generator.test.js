const PGNGenerator = require("../pgn-generator");

describe("PGNGenerator", () => {
  let generator;

  beforeEach(() => {
    generator = new PGNGenerator("./test-output");
  });

  describe("formatMoves", () => {
    it("formats moves with correct numbering", () => {
      const moves = ["e4", "e5", "Nf3", "Nc6"];
      const result = generator.formatMoves(moves, false);
      expect(result).toBe("1. e4 e5 2. Nf3 Nc6");
    });

    it("handles odd number of moves (white's last move)", () => {
      const moves = ["e4", "e5", "Nf3"];
      const result = generator.formatMoves(moves, false);
      expect(result).toBe("1. e4 e5 2. Nf3");
    });

    it("handles single move", () => {
      const result = generator.formatMoves(["e4"], false);
      expect(result).toBe("1. e4");
    });

    it("handles empty moves", () => {
      const result = generator.formatMoves([], false);
      expect(result).toBe("");
    });

    it("includes clock times when requested", () => {
      const moves = ["e4", "e5"];
      const result = generator.formatMoves(moves, true, "1:30:00", "1:29:30");
      expect(result).toContain("{[%clk 1:30:00]}");
      expect(result).toContain("{[%clk 1:29:30]}");
    });

    it("omits clocks when no times provided", () => {
      const moves = ["e4", "e5"];
      const result = generator.formatMoves(moves, true);
      expect(result).not.toContain("{[%clk");
    });
  });

  describe("generatePGN", () => {
    const baseParams = {
      white: { name: "Carlsen, Magnus", rating: "2882" },
      black: { name: "Caruana, Fabiano", rating: "2804" },
      moves: ["e4", "e5", "Nf3", "Nc6"],
      result: "1-0",
      event: "World Championship",
      round: "5",
    };

    it("includes all standard PGN headers", () => {
      const pgn = generator.generatePGN(baseParams);
      expect(pgn).toContain('[Event "World Championship"]');
      expect(pgn).toContain('[Site "Chess Centre"]');
      expect(pgn).toContain('[Round "5"]');
      expect(pgn).toContain('[White "Carlsen, Magnus"]');
      expect(pgn).toContain('[Black "Caruana, Fabiano"]');
      expect(pgn).toContain('[Result "1-0"]');
      expect(pgn).toContain('[WhiteElo "2882"]');
      expect(pgn).toContain('[BlackElo "2804"]');
      expect(pgn).toContain('[PlyCount "4"]');
    });

    it("includes moves and result at the end", () => {
      const pgn = generator.generatePGN(baseParams);
      expect(pgn).toMatch(/Nc6.*1-0\n$/);
    });

    it("generates a valid date header", () => {
      const pgn = generator.generatePGN(baseParams);
      expect(pgn).toMatch(/\[Date "\d{4}\.\d{2}\.\d{2}"\]/);
    });

    it("uses default result of * for ongoing games", () => {
      const pgn = generator.generatePGN({ ...baseParams, result: "*" });
      expect(pgn).toContain('[Result "*"]');
      expect(pgn).toMatch(/\*\n$/);
    });

    it("omits Elo headers when ratings not provided", () => {
      const pgn = generator.generatePGN({
        ...baseParams,
        white: { name: "Player A" },
        black: { name: "Player B" },
      });
      expect(pgn).not.toContain("WhiteElo");
      expect(pgn).not.toContain("BlackElo");
    });
  });
});
