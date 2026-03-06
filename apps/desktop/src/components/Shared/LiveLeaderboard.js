import { useMemo } from "react";
import { usePGN } from "../../hooks/usePgn";
import { useBroadcastSettings } from "../../context/BroadcastSettingsContext";

const ACCENT_MAP = {
  green: "bg-green-400",
  amber: "bg-amber-400",
  blue: "bg-blue-400",
  rose: "bg-rose-400",
  teal: "bg-teal-400",
};

function surname(fullName) {
  if (!fullName) return "---";
  const parts = fullName.trim().split(/\s+/);
  return parts.length > 1 ? parts[parts.length - 1] : fullName;
}

export default function LiveLeaderboard() {
  const { games, active } = usePGN();
  const { settings } = useBroadcastSettings();

  const standings = useMemo(() => {
    const playerSet = new Map();
    games.forEach((game) => {
      [game.whiteInfo, game.blackInfo].forEach((info) => {
        if (info?.name && !playerSet.has(info.name)) {
          playerSet.set(info.name, {
            name: info.name,
            rating: info.rating || "",
            score: 0,
            played: 0,
          });
        }
      });
    });

    const scores = new Map();
    playerSet.forEach((p) =>
      scores.set(p.name, { ...p, score: 0, played: 0, wins: 0, draws: 0, losses: 0 }),
    );

    games.forEach((game) => {
      const r = game.gameResult;
      if (!r || r === "*") return;
      const w = scores.get(game.whiteInfo?.name);
      const b = scores.get(game.blackInfo?.name);
      if (!w || !b) return;

      w.played++;
      b.played++;
      if (r === "1-0") { w.score++; w.wins++; b.losses++; }
      else if (r === "0-1") { b.score++; b.wins++; w.losses++; }
      else if (r === "1/2-1/2") { w.score += 0.5; b.score += 0.5; w.draws++; b.draws++; }
    });

    return Array.from(scores.values()).sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      return (parseInt(b.rating) || 0) - (parseInt(a.rating) || 0);
    });
  }, [games]);

  const accentDot = ACCENT_MAP[settings.accentColor] || ACCENT_MAP.green;

  if (standings.length === 0) {
    return (
      <div className="text-xs text-slate-500 px-2 py-4">Waiting for data...</div>
    );
  }

  return (
    <div className="bg-gh-surface rounded-lg border border-gh-border overflow-hidden">
      <div className="px-3 py-2 border-b border-gh-border flex items-center justify-between">
        <span className="text-xs font-semibold text-gh-textMuted uppercase tracking-wider">
          Standings
        </span>
        <div className={`h-1.5 w-1.5 rounded-full ${active ? `${accentDot} animate-pulse` : "bg-red-400"}`} />
      </div>

      <div className="divide-y divide-gh-border/30">
        {standings.map((player, i) => (
          <div
            key={player.name}
            className="flex items-center gap-2 px-3 py-1.5 hover:bg-slate-700/20"
          >
            <span className="text-xs text-slate-500 w-4 text-right">{i + 1}</span>
            <span className="text-xs text-slate-200 flex-1 truncate">
              {surname(player.name)}
            </span>
            {settings.standingsShowRatings && player.rating && (
              <span className="text-[10px] text-slate-500 tabular-nums">
                {player.rating}
              </span>
            )}
            {settings.standingsShowRecord && (
              <span className="text-[10px] text-slate-500 tabular-nums whitespace-nowrap">
                {player.wins}/{player.draws}/{player.losses}
              </span>
            )}
            {settings.standingsShowPlayed && (
              <span className="text-[10px] text-slate-500 tabular-nums">
                {player.played}g
              </span>
            )}
            <span className="text-xs font-semibold text-slate-300 w-6 text-right tabular-nums">
              {player.score % 1 === 0 ? player.score : player.score.toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
