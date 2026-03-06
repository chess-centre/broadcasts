import { useMemo } from "react";
import { usePGN } from "../../hooks/usePgn";

function surname(fullName) {
  if (!fullName) return "---";
  const parts = fullName.trim().split(/\s+/);
  return parts.length > 1 ? parts[parts.length - 1] : fullName;
}

export default function Crosstable() {
  const { games } = usePGN();

  const { players, results } = useMemo(() => {
    const playerMap = new Map();
    const resultMap = new Map(); // "playerA|playerB" -> result for playerA

    games.forEach((game) => {
      const w = game.whiteInfo?.name;
      const b = game.blackInfo?.name;
      if (!w || !b) return;

      if (!playerMap.has(w)) playerMap.set(w, { name: w, score: 0 });
      if (!playerMap.has(b)) playerMap.set(b, { name: b, score: 0 });

      const r = game.gameResult;
      if (!r || r === "*") return;

      if (r === "1-0") {
        resultMap.set(`${w}|${b}`, "1");
        resultMap.set(`${b}|${w}`, "0");
        playerMap.get(w).score += 1;
      } else if (r === "0-1") {
        resultMap.set(`${w}|${b}`, "0");
        resultMap.set(`${b}|${w}`, "1");
        playerMap.get(b).score += 1;
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
    return <div className="text-xs text-slate-500 px-2 py-4">Waiting for data...</div>;
  }

  return (
    <div className="bg-gh-surface rounded-lg border border-gh-border overflow-hidden">
      <div className="px-3 py-2 border-b border-gh-border">
        <span className="text-xs font-semibold text-gh-textMuted uppercase tracking-wider">
          Crosstable
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gh-border/50">
              <th className="text-left px-2 py-1 text-slate-500 font-normal">#</th>
              <th className="text-left px-2 py-1 text-slate-500 font-normal">Player</th>
              {players.map((_, i) => (
                <th key={i} className="px-1.5 py-1 text-slate-500 font-normal text-center w-7">
                  {i + 1}
                </th>
              ))}
              <th className="px-2 py-1 text-slate-400 font-semibold text-right">Pts</th>
            </tr>
          </thead>
          <tbody>
            {players.map((player, i) => (
              <tr key={player.name} className="border-b border-gh-border/20 hover:bg-slate-700/20">
                <td className="px-2 py-1 text-slate-500 tabular-nums">{i + 1}</td>
                <td className="px-2 py-1 text-slate-200 truncate max-w-[100px]">{surname(player.name)}</td>
                {players.map((opp, j) => {
                  if (i === j) {
                    return (
                      <td key={j} className="px-1.5 py-1 text-center bg-slate-800/50">
                        <span className="text-slate-600">-</span>
                      </td>
                    );
                  }
                  const r = results.get(`${player.name}|${opp.name}`);
                  return (
                    <td key={j} className="px-1.5 py-1 text-center tabular-nums">
                      <span className={
                        r === "1" ? "text-green-400" :
                        r === "0" ? "text-red-400" :
                        r === "\u00BD" ? "text-slate-300" :
                        "text-slate-600"
                      }>
                        {r || "\u00B7"}
                      </span>
                    </td>
                  );
                })}
                <td className="px-2 py-1 text-right font-semibold text-slate-300 tabular-nums">
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
