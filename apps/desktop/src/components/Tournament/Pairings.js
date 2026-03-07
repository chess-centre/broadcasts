import { useState, useEffect, useMemo } from "react";
import { getServerURL } from "../../utils/server-url";

const API = getServerURL();

function surname(fullName) {
  if (!fullName) return "---";
  const parts = fullName.trim().split(/\s+/);
  return parts.length > 1 ? parts[parts.length - 1] : fullName;
}

function resultBadge(result) {
  if (!result || result === "*") {
    return <span className="text-[10px] text-gh-textMuted">--</span>;
  }
  if (result === "1-0") {
    return <span className="text-[10px] font-semibold text-green-400">1-0</span>;
  }
  if (result === "0-1") {
    return <span className="text-[10px] font-semibold text-red-400">0-1</span>;
  }
  return <span className="text-[10px] font-semibold text-slate-300">&frac12;-&frac12;</span>;
}

export default function Pairings({ tournament }) {
  const [selectedRound, setSelectedRound] = useState(0);
  const [results, setResults] = useState({});

  const pairings = useMemo(() => tournament?.pairings || [], [tournament]);
  const totalRounds = pairings.length;

  // Fetch live results periodically
  useEffect(() => {
    let cancelled = false;
    const fetchResults = async () => {
      try {
        const res = await fetch(`${API}/api/tournament`);
        const data = await res.json();
        if (!cancelled && data?.results) {
          setResults(data.results);
        }
      } catch {}
    };
    fetchResults();
    const interval = setInterval(fetchResults, 10000);
    return () => { cancelled = true; clearInterval(interval); };
  }, []);

  const currentRoundPairings = useMemo(() => {
    if (!pairings[selectedRound]) return [];
    return pairings[selectedRound];
  }, [pairings, selectedRound]);

  if (totalRounds === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-12 h-12 rounded-xl bg-amber-500/[0.08] border border-amber-500/20 flex items-center justify-center mb-4">
          <svg className="w-6 h-6 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <p className="text-sm text-gh-textMuted">No pairings available</p>
        <p className="text-xs text-gh-textMuted/60 mt-1">Create a tournament to generate pairings</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Round tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        <span className="text-[10px] text-gh-textMuted uppercase tracking-wider shrink-0">Round</span>
        {Array.from({ length: totalRounds }, (_, i) => (
          <button
            key={i}
            onClick={() => setSelectedRound(i)}
            className={`text-xs min-w-[28px] h-7 rounded flex items-center justify-center transition-all ${
              selectedRound === i
                ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-semibold"
                : "text-gh-textMuted hover:text-gh-text hover:bg-white/[0.03] border border-transparent"
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* Pairings list */}
      <div className="space-y-1.5">
        {currentRoundPairings.map((pairing, i) => {
          const resultKey = `${selectedRound + 1}-${i + 1}`;
          const result = results[resultKey];
          return (
            <div
              key={i}
              className="group relative rounded-lg border border-gh-border/50 bg-white/[0.02] hover:bg-white/[0.04] hover:border-gh-border transition-all overflow-hidden"
            >
              {/* Board number */}
              <div className="absolute left-0 top-0 bottom-0 w-8 flex items-center justify-center bg-white/[0.02] border-r border-gh-border/30">
                <span className="text-[10px] text-gh-textMuted tabular-nums">{i + 1}</span>
              </div>

              <div className="pl-10 pr-3 py-2">
                <div className="flex items-center justify-between">
                  {/* White player */}
                  <div className="flex items-center gap-2 flex-1 min-w-0">
                    <div className="w-3 h-3 rounded-sm bg-white border border-slate-300 shrink-0" />
                    <span className="text-xs text-gh-text truncate">
                      {surname(pairing.white?.name)}
                    </span>
                    {pairing.white?.rating && (
                      <span className="text-[10px] text-gh-textMuted tabular-nums">
                        {pairing.white.rating}
                      </span>
                    )}
                  </div>

                  {/* Result */}
                  <div className="mx-3 shrink-0">
                    {resultBadge(result)}
                  </div>

                  {/* Black player */}
                  <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
                    {pairing.black?.rating && (
                      <span className="text-[10px] text-gh-textMuted tabular-nums">
                        {pairing.black.rating}
                      </span>
                    )}
                    <span className="text-xs text-gh-text truncate text-right">
                      {surname(pairing.black?.name)}
                    </span>
                    <div className="w-3 h-3 rounded-sm bg-slate-800 border border-slate-600 shrink-0" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary footer */}
      <div className="flex items-center justify-between pt-2 border-t border-gh-border/30">
        <span className="text-[10px] text-gh-textMuted">
          {currentRoundPairings.length} boards &middot; Round {selectedRound + 1} of {totalRounds}
        </span>
        <span className="text-[10px] text-gh-textMuted">
          {tournament?.format?.replace("-", " ")}
        </span>
      </div>
    </div>
  );
}
