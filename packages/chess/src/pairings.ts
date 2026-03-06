export interface Player {
  name: string;
  rating: string;
}

export interface Pairing {
  white: Player;
  black: Player;
}

export interface Tournament {
  format: "round-robin" | "swiss";
  players: Player[];
}

export function generateRoundRobinPairings(players: Player[]): Pairing[][] {
  const n = players.length;
  const rounds = n % 2 === 0 ? n - 1 : n;
  const padded = [...players];
  if (n % 2 !== 0) padded.push({ name: "BYE", rating: "" });

  const pairings: Pairing[][] = [];
  const fixed = padded[0];
  const rotating = padded.slice(1);

  for (let round = 0; round < rounds; round++) {
    const current = [fixed, ...rotating];
    const half = current.length / 2;
    const roundPairings: Pairing[] = [];

    for (let i = 0; i < half; i++) {
      const a = current[i];
      const b = current[current.length - 1 - i];
      if (a.name === "BYE" || b.name === "BYE") continue;
      if (round % 2 === 0) roundPairings.push({ white: a, black: b });
      else roundPairings.push({ white: b, black: a });
    }

    pairings.push(roundPairings);
    rotating.unshift(rotating.pop()!);
  }

  return pairings;
}

export function generateSwissPairings(players: Player[]): Pairing[][] {
  const sorted = [...players].sort(
    (a, b) => (parseInt(b.rating) || 0) - (parseInt(a.rating) || 0)
  );
  const half = Math.ceil(sorted.length / 2);
  const top = sorted.slice(0, half);
  const bottom = sorted.slice(half);

  const roundPairings: Pairing[] = [];
  for (let i = 0; i < top.length; i++) {
    if (i < bottom.length)
      roundPairings.push({ white: top[i], black: bottom[i] });
  }

  return [roundPairings];
}

export function calculateRounds(
  format: string,
  playerCount: number
): number {
  if (format === "round-robin")
    return playerCount % 2 === 0 ? playerCount - 1 : playerCount;
  return Math.max(1, Math.ceil(Math.log2(playerCount || 2)));
}

export function generatePairings(tournament: Tournament): Pairing[][] {
  if (tournament.format === "round-robin")
    return generateRoundRobinPairings(tournament.players);
  return generateSwissPairings(tournament.players);
}
