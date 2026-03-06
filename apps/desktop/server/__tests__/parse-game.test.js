const parseGame = require("../parse-game");

const makePGN = (headers, moves, result = "*") => {
  const headerLines = Object.entries(headers)
    .map(([k, v]) => `[${k} "${v}"]`)
    .join("\n");
  return `${headerLines}\n[Result "${result}"]\n\n${moves} ${result}\n`;
};

describe("parseGame", () => {
  it("extracts player info and result from PGN headers", () => {
    const pgn = makePGN(
      {
        White: "Carlsen, Magnus",
        Black: "Caruana, Fabiano",
        WhiteElo: "2882",
        BlackElo: "2804",
        Event: "Test Event",
        Round: "3",
      },
      "1. e4 e5 2. Nf3 Nc6",
      "1/2-1/2",
    );

    const result = parseGame(pgn);
    expect(result.whiteInfo.name).toBe("Carlsen, Magnus");
    expect(result.blackInfo.name).toBe("Caruana, Fabiano");
    expect(String(result.whiteInfo.rating)).toBe("2882");
    expect(String(result.blackInfo.rating)).toBe("2804");
    expect(result.gameResult).toBe("1/2-1/2");
    expect(result.event).toBe("Test Event");
    expect(result.round).toBe("3");
  });

  it("generates correct FEN from moves", () => {
    const pgn = makePGN(
      { White: "A", Black: "B" },
      "1. e4 e5",
    );

    const result = parseGame(pgn);
    // After 1. e4 e5, the FEN should have pawns on e4 and e5
    expect(result.fen).toContain("pppp");
    expect(result.fen).toContain("PPPP");
    // White's turn after 1...e5
    expect(result.fen).toMatch(/\sw\s/);
  });

  it("counts moves correctly", () => {
    const pgn = makePGN(
      { White: "A", Black: "B" },
      "1. d4 d5 2. c4 e6 3. Nc3 Nf6",
    );

    const result = parseGame(pgn);
    expect(result.moveCount).toBe(6); // 6 half-moves
    expect(result.currentMove).toBe(3); // 3 full moves
  });

  it("marks ongoing games correctly", () => {
    const pgn = makePGN(
      { White: "A", Black: "B" },
      "1. e4 e5",
      "*",
    );

    const result = parseGame(pgn);
    expect(result.status).toBe("ongoing");
    expect(result.gameResult).toBe("*");
  });

  it("marks finished games correctly", () => {
    const pgn = makePGN(
      { White: "A", Black: "B" },
      "1. e4 e5",
      "1-0",
    );

    const result = parseGame(pgn);
    expect(result.status).toBe("finished");
    expect(result.gameResult).toBe("1-0");
  });

  it("extracts clock times from DGT format comments", () => {
    const pgn = [
      '[White "A"]',
      '[Black "B"]',
      '[Result "*"]',
      "",
      "1. e4 {[%clk 1:29:30]} e5 {[%clk 1:28:45]} *",
    ].join("\n");

    const result = parseGame(pgn);
    // Clock times should be extracted (exact format depends on parser)
    expect(result.whiteClock).toMatch(/\d{2}:\d{2}:\d{2}/);
    expect(result.blackClock).toMatch(/\d{2}:\d{2}:\d{2}/);
  });

  it("handles invalid PGN gracefully", () => {
    const result = parseGame("not a valid pgn at all }{{}");
    expect(result.status).toBe("error");
    expect(result.gameResult).toBe("*");
    expect(result.whiteInfo.name).toBe("Unknown");
    expect(result.blackInfo.name).toBe("Unknown");
  });

  it("preserves the original PGN string", () => {
    const pgn = makePGN(
      { White: "A", Black: "B" },
      "1. e4 e5",
    );

    const result = parseGame(pgn);
    expect(result.pgn).toBe(pgn);
  });

  it("defaults missing headers gracefully", () => {
    const pgn = '[Result "*"]\n\n1. e4 *\n';
    const result = parseGame(pgn);
    expect(result.whiteInfo.name).toBe("Unknown");
    expect(result.blackInfo.name).toBe("Unknown");
    expect(result.whiteInfo.rating).toBe("");
  });

  it("handles white wins result", () => {
    const pgn = makePGN(
      { White: "A", Black: "B" },
      "1. e4 e5",
      "1-0",
    );
    expect(parseGame(pgn).gameResult).toBe("1-0");
  });

  it("handles black wins result", () => {
    const pgn = makePGN(
      { White: "A", Black: "B" },
      "1. e4 e5",
      "0-1",
    );
    expect(parseGame(pgn).gameResult).toBe("0-1");
  });
});
