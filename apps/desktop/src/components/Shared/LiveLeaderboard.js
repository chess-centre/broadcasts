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

export default function LiveLeaderboard({ compact = false }) {
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
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-10 h-10 rounded-lg bg-emerald-500/[0.08] border border-emerald-500/20 flex items-center justify-center mb-3">
          <svg className="w-5 h-5 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.996.178-1.768.56-2.018 1.258C2.79 6.582 5.156 8.024 8.91 8.653c1.606.269 2.943.1 3.887-.47M18.75 4.236c.996.178 1.768.56 2.018 1.258.442 1.088-1.924 2.53-5.678 3.16-1.606.268-2.943.099-3.887-.471" />
          </svg>
        </div>
        <p className="text-xs text-gh-textMuted">Waiting for game data...</p>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-gh-border bg-white/[0.01] overflow-hidden">
      {!compact && (
        <div className="px-4 py-2.5 border-b border-gh-border/50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.996.178-1.768.56-2.018 1.258C2.79 6.582 5.156 8.024 8.91 8.653c1.606.269 2.943.1 3.887-.47M18.75 4.236c.996.178 1.768.56 2.018 1.258.442 1.088-1.924 2.53-5.678 3.16-1.606.268-2.943.099-3.887-.471" />
            </svg>
            <span className="text-xs font-semibold text-gh-textMuted uppercase tracking-wider">
              Standings
            </span>
          </div>
          <div className={`h-2 w-2 rounded-full ${active ? `${accentDot} animate-pulse` : "bg-red-400"}`} />
        </div>
      )}

      <div className="divide-y divide-gh-border/20">
        {standings.map((player, i) => (
          <div
            key={player.name}
            className={`flex items-center gap-2.5 px-4 py-2 transition-colors hover:bg-white/[0.03] ${
              i === 0 ? "bg-emerald-500/[0.03]" : ""
            }`}
          >
            {/* Rank */}
            <span className={`text-xs w-5 text-right tabular-nums ${
              i === 0 ? "text-emerald-400 font-semibold" : "text-gh-textMuted"
            }`}>
              {i + 1}
            </span>

            {/* Medal for top 3 */}
            {i < 3 && (
              <span className={`text-xs shrink-0 ${
                i === 0 ? "text-yellow-400" : i === 1 ? "text-slate-300" : "text-amber-600"
              }`}>
                {i === 0 ? "\u25CF" : "\u25CB"}
              </span>
            )}

            {/* Player name */}
            <span className={`text-xs flex-1 truncate ${
              i === 0 ? "text-emerald-400 font-medium" : "text-gh-text"
            }`}>
              {surname(player.name)}
            </span>

            {settings.standingsShowRatings && player.rating && (
              <span className="text-[10px] text-gh-textMuted tabular-nums">
                {player.rating}
              </span>
            )}
            {settings.standingsShowRecord && (
              <span className="text-[10px] text-gh-textMuted tabular-nums whitespace-nowrap">
                {player.wins}/{player.draws}/{player.losses}
              </span>
            )}
            {settings.standingsShowPlayed && (
              <span className="text-[10px] text-gh-textMuted tabular-nums">
                {player.played}g
              </span>
            )}

            {/* Score */}
            <span className={`text-xs w-7 text-right tabular-nums font-semibold ${
              i === 0 ? "text-emerald-400" : "text-gh-text"
            }`}>
              {player.score % 1 === 0 ? player.score : player.score.toFixed(1)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
