import { useMemo } from "react";
import { usePGN } from "../../hooks/usePgn";

function surname(fullName) {
  if (!fullName) return "---";
  const parts = fullName.trim().split(/\s+/);
  return parts.length > 1 ? parts[parts.length - 1] : fullName;
}

export default function Crosstable({ compact = false }) {
  const { games } = usePGN();

  const { players, results } = useMemo(() => {
    const playerMap = new Map();
    const resultMap = new Map();

    games.forEach((game) => {
      const w = game.whiteInfo?.name;
      const b = game.blackInfo?.name;
      if (!w || !b) return;

      if (!playerMap.has(w)) playerMap.set(w, { name: w, score: 0, played: 0, wins: 0 });
      if (!playerMap.has(b)) playerMap.set(b, { name: b, score: 0, played: 0, wins: 0 });

      const r = game.gameResult;
      if (!r || r === "*") return;

      playerMap.get(w).played++;
      playerMap.get(b).played++;

      if (r === "1-0") {
        resultMap.set(`${w}|${b}`, "1");
        resultMap.set(`${b}|${w}`, "0");
        playerMap.get(w).score += 1;
        playerMap.get(w).wins++;
      } else if (r === "0-1") {
        resultMap.set(`${w}|${b}`, "0");
        resultMap.set(`${b}|${w}`, "1");
        playerMap.get(b).score += 1;
        playerMap.get(b).wins++;
      } else if (r === "1/2-1/2") {
        resultMap.set(`${w}|${b}`, "\u00BD");
        resultMap.set(`${b}|${w}`, "\u00BD");
        playerMap.get(w).score += 0.5;
        playerMap.get(b).score += 0.5;
      }
    });

    const sorted = Array.from(playerMap.values()).sort((a, b) => b.score - a.score);
    return { players: sorted, results: resultMap };
  }, [games]);

  if (players.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-10 h-10 rounded-lg bg-amber-500/[0.08] border border-amber-500/20 flex items-center justify-center mb-3">
          <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6z" />
          </svg>
        </div>
        <p className="text-xs text-gh-textMuted">Waiting for game data...</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gh-border bg-white/[0.01] overflow-hidden">
      {!compact && (
        <div className="px-4 py-2.5 border-b border-gh-border/50 flex items-center gap-2">
          <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6z" />
          </svg>
          <span className="text-xs font-semibold text-gh-textMuted uppercase tracking-wider">
            Crosstable
          </span>
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gh-border/40">
              <th className="text-left px-3 py-2 text-gh-textMuted font-medium w-6">#</th>
              <th className="text-left px-2 py-2 text-gh-textMuted font-medium">Player</th>
              {players.map((_, i) => (
                <th key={i} className="px-1 py-2 text-gh-textMuted font-medium text-center w-8">
                  {i + 1}
                </th>
              ))}
              <th className="px-3 py-2 text-emerald-400 font-semibold text-right">Pts</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, i) => (
              <tr
                key={player.name}
                className={`border-b border-gh-border/20 transition-colors hover:bg-white/[0.03] ${
                  i === 0 ? "bg-emerald-500/[0.03]" : ""
                }`}
              >
                <td className="px-3 py-1.5 text-gh-textMuted tabular-nums">{i + 1}</td>
                <td className="px-2 py-1.5 truncate max-w-[120px]">
                  <span className={i === 0 ? "text-emerald-400 font-medium" : "text-gh-text"}>
                    {surname(player.name)}
                  </span>
                </td>
                {players.map((opp, j) => {
                  if (i === j) {
                    return (
                      <td key={j} className="px-1 py-1.5 text-center">
                        <span className="inline-block w-6 h-6 rounded bg-white/[0.04] leading-6 text-gh-border">
                          -
                        </span>
                      </td>
                    );
                  }
                  const r = results.get(`${player.name}|${opp.name}`);
                  return (
                    <td key={j} className="px-1 py-1.5 text-center tabular-nums">
                      <span className={`inline-block w-6 h-6 rounded leading-6 text-xs font-medium ${
                        r === "1" ? "bg-emerald-500/[0.12] text-emerald-400" :
                        r === "0" ? "bg-red-500/[0.08] text-red-400" :
                        r === "\u00BD" ? "bg-white/[0.04] text-slate-300" :
                        "text-gh-border"
                      }`}>
                        {r || "\u00B7"}
                      </span>
                    </td>
                  );
                })}
                <td className={`px-3 py-1.5 text-right tabular-nums font-semibold ${
                  i === 0 ? "text-emerald-400" : "text-gh-text"
                }`}>
                  {player.score % 1 === 0 ? player.score : player.score.toFixed(1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
