function surname(fullName: string): string {
  if (!fullName) return "?";
  const parts = fullName.trim().split(/\s+/);
  return parts.length > 1 ? parts[parts.length - 1] : fullName;
}

export interface GameInfo {
  whiteInfo?: { name: string };
  blackInfo?: { name: string };
  gameResult: string;
  moveCount?: number;
}

export interface StandingsEntry {
  name: string;
  score: number;
  played: number;
}

export function generateGameEndPost(
  game: GameInfo,
  boardNum?: number
): { text: string } | null {
  const white = game.whiteInfo?.name || "White";
  const black = game.blackInfo?.name || "Black";
  const result = game.gameResult;

  let outcome: string;
  if (result === "1-0") outcome = `${surname(white)} defeats ${surname(black)}`;
  else if (result === "0-1")
    outcome = `${surname(black)} defeats ${surname(white)}`;
  else if (result === "1/2-1/2")
    outcome = `${surname(white)} draws with ${surname(black)}`;
  else return null;

  const moveCount = game.moveCount
    ? `${Math.ceil(game.moveCount / 2)} moves`
    : "";

  let text = outcome;
  if (moveCount) text += ` in ${moveCount}`;
  text += ".";
  if (boardNum) text += ` Board ${boardNum}.`;

  return { text };
}

export function generateStandingsPost(
  standings: StandingsEntry[],
  eventName?: string,
  roundNum?: number
): { text: string } {
  const header = eventName
    ? `${eventName}${roundNum ? ` - After Round ${roundNum}` : ""}`
    : `Standings${roundNum ? ` after Round ${roundNum}` : ""}`;

  const lines = standings
    .slice(0, 10)
    .map(
      (p, i) =>
        `${i + 1}. ${surname(p.name)} ${p.score % 1 === 0 ? p.score : p.score.toFixed(1)}/${p.played}`
    );

  return { text: `${header}\n\n${lines.join("\n")}` };
}

export function generateRoundSummary(
  games: GameInfo[],
  roundNum?: number
): { text: string } {
  let decisive = 0,
    draws = 0,
    ongoing = 0;

  games.forEach((game) => {
    const r = game.gameResult;
    if (!r || r === "*") ongoing++;
    else if (r === "1/2-1/2") draws++;
    else decisive++;
  });

  const total = decisive + draws;

  if (total === 0)
    return { text: `Round ${roundNum || "?"}: No completed games yet.` };

  let text: string;
  if (ongoing > 0)
    text = `Round ${roundNum || "?"} update: ${total} finished (${decisive} decisive, ${draws} draw${draws !== 1 ? "s" : ""}), ${ongoing} ongoing.`;
  else
    text = `Round ${roundNum || "?"} complete! ${total} games: ${decisive} decisive, ${draws} draw${draws !== 1 ? "s" : ""}.`;

  return { text };
}
