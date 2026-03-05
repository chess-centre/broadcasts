/**
 * Tournament pairing engine.
 *
 * Round-robin: circle method (Berger tables) with color alternation.
 * Swiss: simplified first-round pairing (top-half vs bottom-half by rating).
 */

function generateRoundRobinPairings(players) {
  const n = players.length;
  const rounds = n % 2 === 0 ? n - 1 : n;
  const padded = [...players];
  if (n % 2 !== 0) padded.push({ name: "BYE", rating: "" });

  const pairings = [];
  const fixed = padded[0];
  const rotating = padded.slice(1);

  for (let round = 0; round < rounds; round++) {
    const current = [fixed, ...rotating];
    const half = current.length / 2;
    const roundPairings = [];

    for (let i = 0; i < half; i++) {
      const a = current[i];
      const b = current[current.length - 1 - i];
      if (a.name === "BYE" || b.name === "BYE") continue;

      // Alternate colors by round
      if (round % 2 === 0) {
        roundPairings.push({ white: a, black: b });
      } else {
        roundPairings.push({ white: b, black: a });
      }
    }

    pairings.push(roundPairings);
    // Rotate: move last element to position 0
    rotating.unshift(rotating.pop());
  }

  return pairings;
}

function generateSwissPairings(players) {
  // Round 1: sort by rating, pair top-half vs bottom-half
  const sorted = [...players].sort(
    (a, b) => (parseInt(b.rating) || 0) - (parseInt(a.rating) || 0),
  );
  const half = Math.ceil(sorted.length / 2);
  const top = sorted.slice(0, half);
  const bottom = sorted.slice(half);

  const roundPairings = [];
  for (let i = 0; i < top.length; i++) {
    if (i < bottom.length) {
      roundPairings.push({ white: top[i], black: bottom[i] });
    }
  }
  return [roundPairings];
}

function calculateRounds(format, playerCount) {
  if (format === "round-robin") {
    return playerCount % 2 === 0 ? playerCount - 1 : playerCount;
  }
  // Swiss: ceil(log2(n)) is the standard recommendation
  return Math.max(1, Math.ceil(Math.log2(playerCount || 2)));
}

function generatePairings(tournament) {
  if (tournament.format === "round-robin") {
    return generateRoundRobinPairings(tournament.players);
  }
  return generateSwissPairings(tournament.players);
}

module.exports = {
  generatePairings,
  calculateRounds,
  generateRoundRobinPairings,
  generateSwissPairings,
};
