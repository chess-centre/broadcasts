import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ConfigDashboard from "../components/SimulatorPanel";
import BoardHealthDashboard from "../components/BoardHealthDashboard";
import TournamentWizard from "../components/Tournament/TournamentWizard";
import { getServerURL } from "../utils/server-url";

const API = getServerURL();

export default function Home() {
  const navigate = useNavigate();
  const [tournament, setTournament] = useState(null);
  const [showWizard, setShowWizard] = useState(false);

  useEffect(() => {
    fetch(`${API}/api/tournament`)
      .then((r) => r.json())
      .then((data) => { if (data) setTournament(data); })
      .catch(() => {});
  }, []);

  const handleDelete = async () => {
    await fetch(`${API}/api/tournament`, { method: "DELETE" });
    setTournament(null);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 font-mono">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xs text-gh-textMuted uppercase tracking-wider">chess broadcast system</h1>
        <button
          onClick={() => navigate("/live")}
          className="text-[10px] uppercase tracking-wider text-green-400 hover:text-green-300 transition-colors"
        >
          open live view &rarr;
        </button>
      </div>

      <div className="space-y-3">
        <ConfigDashboard />
        <BoardHealthDashboard />

        {/* Tournament section */}
        {showWizard ? (
          <TournamentWizard
            onComplete={(t) => {
              setTournament(t);
              setShowWizard(false);
            }}
            onCancel={() => setShowWizard(false)}
          />
        ) : tournament ? (
          <div className="border border-gh-border rounded bg-gh-surface/30 overflow-hidden">
            <div className="px-3 py-1.5 border-b border-gh-border bg-gh-surface/50 flex items-center justify-between">
              <span className="text-[10px] uppercase tracking-wider text-gh-textMuted">Tournament</span>
              <span className="text-[10px] text-green-400">Active</span>
            </div>
            <div className="divide-y divide-gh-border/50">
              <div className="flex items-center justify-between px-3 py-1 text-xs">
                <span className="text-gh-textMuted">event</span>
                <span className="text-gh-text">{tournament.event}</span>
              </div>
              <div className="flex items-center justify-between px-3 py-1 text-xs">
                <span className="text-gh-textMuted">format</span>
                <span className="text-gh-text capitalize">{tournament.format?.replace("-", " ")}</span>
              </div>
              <div className="flex items-center justify-between px-3 py-1 text-xs">
                <span className="text-gh-textMuted">players</span>
                <span className="text-gh-text">{tournament.players?.length}</span>
              </div>
              <div className="flex items-center justify-between px-3 py-1 text-xs">
                <span className="text-gh-textMuted">rounds</span>
                <span className="text-gh-text">{tournament.rounds}</span>
              </div>
              <div className="flex items-center justify-between px-3 py-1 text-xs">
                <span className="text-gh-textMuted">date</span>
                <span className="text-gh-text">{tournament.date}</span>
              </div>
            </div>
            <div className="px-3 py-2 flex items-center gap-2 border-t border-gh-border/50">
              <button
                onClick={() => { handleDelete(); setShowWizard(true); }}
                className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors"
              >
                New Tournament
              </button>
              <button
                onClick={handleDelete}
                className="text-[10px] text-red-400 hover:text-red-300 transition-colors"
              >
                Clear
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => setShowWizard(true)}
            className="w-full border border-dashed border-gh-border rounded py-3 text-xs text-gh-textMuted hover:text-gh-text hover:border-slate-500 transition-colors"
          >
            + Set up tournament
          </button>
        )}
      </div>
    </div>
  );
}
