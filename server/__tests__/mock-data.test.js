const {
  players,
  openings,
  timeToSeconds,
  secondsToTime,
  generatePairing,
  generateOpening,
  generateMiddlegameMoves,
  getTimeControl,
  getRandomResult,
} = require("../mock-data");

describe("timeToSeconds", () => {
  it("converts hours:minutes:seconds to total seconds", () => {
    expect(timeToSeconds("01:30:00")).toBe(5400);
    expect(timeToSeconds("00:45:00")).toBe(2700);
    expect(timeToSeconds("00:00:30")).toBe(30);
    expect(timeToSeconds("00:00:00")).toBe(0);
  });

  it("handles various time formats", () => {
    expect(timeToSeconds("02:00:00")).toBe(7200);
    expect(timeToSeconds("00:01:01")).toBe(61);
  });
});

describe("secondsToTime", () => {
  it("converts seconds to HH:MM:SS format", () => {
    expect(secondsToTime(5400)).toBe("01:30:00");
    expect(secondsToTime(2700)).toBe("00:45:00");
    expect(secondsToTime(30)).toBe("00:00:30");
    expect(secondsToTime(0)).toBe("00:00:00");
  });

  it("pads single digits with zeros", () => {
    expect(secondsToTime(61)).toBe("00:01:01");
    expect(secondsToTime(3661)).toBe("01:01:01");
  });

  it("roundtrips with timeToSeconds", () => {
    const times = ["01:30:00", "00:45:00", "00:15:05", "02:00:00"];
    for (const t of times) {
      expect(secondsToTime(timeToSeconds(t))).toBe(t);
    }
  });
});

describe("generatePairing", () => {
  it("returns two different players", () => {
    const pairing = generatePairing();
    expect(pairing.white).toBeDefined();
    expect(pairing.black).toBeDefined();
    expect(pairing.white.name).not.toBe(pairing.black.name);
  });

  it("has name and rating on both players", () => {
    const pairing = generatePairing();
    expect(pairing.white.name).toBeTruthy();
    expect(pairing.white.rating).toBeTruthy();
    expect(pairing.black.name).toBeTruthy();
    expect(pairing.black.rating).toBeTruthy();
  });

  it("avoids already-used players", () => {
    const used = players.slice(0, 18); // use all but 2
    const pairing = generatePairing(used);
    const usedNames = used.map((p) => p.name);
    expect(usedNames).not.toContain(pairing.white.name);
    expect(usedNames).not.toContain(pairing.black.name);
  });

  it("falls back when all players are used", () => {
    const pairing = generatePairing([...players]);
    // Should still return a pairing (falls back to random)
    expect(pairing.white).toBeDefined();
    expect(pairing.black).toBeDefined();
  });
});

describe("generateOpening", () => {
  it("returns an opening with name and moves", () => {
    const opening = generateOpening();
    expect(opening.name).toBeTruthy();
    expect(opening.moves).toBeTruthy();
    expect(opening.moves).toMatch(/1\./); // Contains move numbers
  });
});

describe("generateMiddlegameMoves", () => {
  it("returns the requested number of moves", () => {
    expect(generateMiddlegameMoves(5)).toHaveLength(5);
    expect(generateMiddlegameMoves(10)).toHaveLength(10);
  });

  it("returns valid SAN-like move strings", () => {
    const moves = generateMiddlegameMoves(5);
    for (const move of moves) {
      expect(move).toMatch(/^[A-Za-z]/);
    }
  });
});

describe("getTimeControl", () => {
  it("returns an object with initial time and increment", () => {
    const tc = getTimeControl();
    expect(tc.initial).toMatch(/^\d{2}:\d{2}:\d{2}$/);
    expect(typeof tc.increment).toBe("number");
  });
});

describe("getRandomResult", () => {
  it("returns a valid chess result", () => {
    const validResults = ["1-0", "0-1", "1/2-1/2"];
    for (let i = 0; i < 20; i++) {
      expect(validResults).toContain(getRandomResult());
    }
  });
});

describe("data integrity", () => {
  it("has at least 10 players", () => {
    expect(players.length).toBeGreaterThanOrEqual(10);
  });

  it("has at least 5 openings", () => {
    expect(openings.length).toBeGreaterThanOrEqual(5);
  });

  it("all players have name and rating", () => {
    for (const player of players) {
      expect(player.name).toBeTruthy();
      expect(player.rating).toBeTruthy();
    }
  });

  it("all openings have continuations", () => {
    for (const opening of openings) {
      expect(opening.continuation.length).toBeGreaterThan(0);
    }
  });
});
