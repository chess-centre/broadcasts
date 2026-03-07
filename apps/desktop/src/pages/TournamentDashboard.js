import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PGNProvider } from "../hooks/usePgn";
import { BroadcastSettingsProvider } from "../context/BroadcastSettingsContext";
import Pairings from "../components/Tournament/Pairings";
import LiveLeaderboard from "../components/Shared/LiveLeaderboard";
import Crosstable from "../components/Shared/Crosstable";
import TournamentWizard from "../components/Tournament/TournamentWizard";
import { getServerURL } from "../utils/server-url";

const API = getServerURL();

const TABS = [
  { id: "pairings", label: "Pairings", icon: PairingsIcon },
  { id: "standings", label: "Standings", icon: StandingsIcon },
  { id: "crosstable", label: "Crosstable", icon: CrosstableIcon },
];

function PairingsIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 6.75h12M8.25 12h12m-12 5.25h12M3.75 6.75h.007v.008H3.75V6.75zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zM3.75 12h.007v.008H3.75V12zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm-.375 5.25h.007v.008H3.75v-.008zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
    </svg>
  );
}

function StandingsIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.996.178-1.768.56-2.018 1.258C2.79 6.582 5.156 8.024 8.91 8.653c1.606.269 2.943.1 3.887-.47M18.75 4.236c.996.178 1.768.56 2.018 1.258.442 1.088-1.924 2.53-5.678 3.16-1.606.268-2.943.099-3.887-.471" />
    </svg>
  );
}

function CrosstableIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6z" />
    </svg>
  );
}

function TournamentHeader({ tournament, onNewTournament, onDeleteTournament }) {
  if (!tournament) return null;

  return (
    <div className="rounded-lg border border-gh-border bg-white/[0.02] overflow-hidden">
      <div className="px-5 py-4">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-semibold text-gh-text">{tournament.event}</h2>
            <div className="flex items-center gap-3 mt-1.5">
              <span className="text-xs text-gh-textMuted">{tournament.date}</span>
              {tournament.venue && (
                <>
                  <span className="text-gh-border">&middot;</span>
                  <span className="text-xs text-gh-textMuted">{tournament.venue}</span>
                </>
              )}
              <span className="text-gh-border">&middot;</span>
              <span className="text-xs text-gh-textMuted capitalize">
                {tournament.format?.replace("-", " ")}
              </span>
              <span className="text-gh-border">&middot;</span>
              <span className="text-xs text-gh-textMuted">
                {tournament.players?.length} players
              </span>
              <span className="text-gh-border">&middot;</span>
              <span className="text-xs text-gh-textMuted">
                {tournament.rounds} rounds
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] font-medium text-emerald-400 bg-emerald-500/[0.08] border border-emerald-500/20 rounded-full">
              <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
              Active
            </span>
          </div>
        </div>
      </div>
      <div className="px-5 py-2 border-t border-gh-border/30 flex items-center gap-3">
        <button
          onClick={onNewTournament}
          className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors"
        >
          New Tournament
        </button>
        <button
          onClick={onDeleteTournament}
          className="text-[10px] text-red-400 hover:text-red-300 transition-colors"
        >
          Clear Tournament
        </button>
      </div>
    </div>
  );
}

function TournamentDashboardContent() {
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [activeTab, setActiveTab] = useState("pairings");
  const [showWizard, setShowWizard] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/tournament`)
      .then((r) => r.json())
      .then((data) => {
        if (data) setTournament(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handleDelete = async () => {
    await fetch(`${API}/api/tournament`, { method: "DELETE" });
    setTournament(null);
  };

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-6 py-12">
        <div className="flex items-center justify-center h-40">
          <div className="w-5 h-5 border-2 border-emerald-400/30 border-t-emerald-400 rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (showWizard) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-8">
        <TournamentWizard
          onComplete={(t) => {
            setTournament(t);
            setShowWizard(false);
          }}
          onCancel={() => setShowWizard(false)}
        />
      </div>
    );
  }

  if (!tournament) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-16">
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/[0.08] border border-emerald-500/20 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.996.178-1.768.56-2.018 1.258C2.79 6.582 5.156 8.024 8.91 8.653c1.606.269 2.943.1 3.887-.47M18.75 4.236c.996.178 1.768.56 2.018 1.258.442 1.088-1.924 2.53-5.678 3.16-1.606.268-2.943.099-3.887-.471" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gh-text mb-2">No Tournament Active</h2>
          <p className="text-sm text-gh-textMuted mb-8 max-w-md mx-auto">
            Set up a tournament to manage pairings, track standings, and generate a live crosstable for your event.
          </p>
          <button
            onClick={() => setShowWizard(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-black bg-emerald-400 rounded-lg hover:bg-emerald-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            Create Tournament
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-6 py-6 space-y-5">
      {/* Tournament info header */}
      <TournamentHeader
        tournament={tournament}
        onNewTournament={() => { handleDelete(); setShowWizard(true); }}
        onDeleteTournament={handleDelete}
      />

      {/* Tab bar */}
      <div className="flex items-center gap-1 border-b border-gh-border/50">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium transition-colors border-b-2 -mb-px ${
              activeTab === id
                ? "text-emerald-400 border-emerald-400"
                : "text-gh-textMuted hover:text-gh-text border-transparent"
            }`}
          >
            <Icon className="w-3.5 h-3.5" />
            {label}
          </button>
        ))}

        <div className="flex-1" />

        <button
          onClick={() => navigate("/live")}
          className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-medium text-emerald-400 bg-emerald-500/[0.08] border border-emerald-500/20 rounded-md hover:bg-emerald-500/[0.15] transition-colors mb-1"
        >
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          Open Live View
        </button>
      </div>

      {/* Tab content */}
      <div>
        {activeTab === "pairings" && <Pairings tournament={tournament} />}
        {activeTab === "standings" && <LiveLeaderboard />}
        {activeTab === "crosstable" && <Crosstable />}
      </div>
    </div>
  );
}

export default function TournamentDashboard() {
  return (
    <PGNProvider>
      <BroadcastSettingsProvider>
        <TournamentDashboardContent />
      </BroadcastSettingsProvider>
    </PGNProvider>
  );
}
