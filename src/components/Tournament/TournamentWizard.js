import { useState } from "react";
import StepEventInfo from "./StepEventInfo";
import StepPlayers from "./StepPlayers";
import StepFormat from "./StepFormat";
import StepReview from "./StepReview";

const API = process.env.REACT_APP_SERVER_URL || "http://localhost:8080";

const STEPS = ["Event", "Players", "Format", "Review"];

export default function TournamentWizard({ onComplete, onCancel }) {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    event: "",
    date: new Date().toISOString().split("T")[0],
    venue: "",
    timeControl: "90+30",
    players: [],
    format: "round-robin",
    rounds: 0,
  });

  const updateData = (partial) => setData((prev) => ({ ...prev, ...partial }));

  const canAdvance = () => {
    if (step === 0) return data.event.trim().length > 0;
    if (step === 1) return data.players.length >= 2;
    if (step === 2) return data.rounds > 0;
    return true;
  };

  const handleCreate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API}/api/tournament/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const result = await res.json();
      if (result.ok) {
        onComplete?.(result.tournament);
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="border border-gh-border rounded bg-gh-surface/30 overflow-hidden">
      {/* Header with step indicator */}
      <div className="px-3 py-1.5 border-b border-gh-border bg-gh-surface/50 flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-wider text-gh-textMuted">
          Tournament Setup
        </span>
        <div className="flex items-center gap-1">
          {STEPS.map((s, i) => (
            <span
              key={i}
              className={`text-[10px] px-1.5 py-0.5 rounded transition-colors ${
                i === step
                  ? "bg-blue-600 text-white"
                  : i < step
                    ? "text-green-400"
                    : "text-gh-textMuted"
              }`}
            >
              {i < step ? "\u2713" : i + 1}
            </span>
          ))}
        </div>
      </div>

      <div className="p-3">
        {step === 0 && <StepEventInfo data={data} onChange={updateData} />}
        {step === 1 && <StepPlayers data={data} onChange={updateData} />}
        {step === 2 && <StepFormat data={data} onChange={updateData} />}
        {step === 3 && <StepReview data={data} />}

        {error && <p className="text-xs text-red-400 mt-2">{error}</p>}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gh-border/50">
          <div className="flex items-center gap-2">
            {step > 0 && (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="px-3 py-1 text-xs text-gh-textMuted hover:text-gh-text transition-colors"
              >
                Back
              </button>
            )}
            {onCancel && step === 0 && (
              <button
                onClick={onCancel}
                className="px-3 py-1 text-xs text-gh-textMuted hover:text-gh-text transition-colors"
              >
                Cancel
              </button>
            )}
          </div>
          {step < 3 ? (
            <button
              onClick={() => setStep((s) => s + 1)}
              disabled={!canAdvance()}
              className="px-3 py-1 text-xs font-medium text-black bg-green-400 rounded hover:bg-green-300 transition-colors disabled:opacity-30 disabled:hover:bg-green-400"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleCreate}
              disabled={loading}
              className="px-3 py-1 text-xs font-medium text-black bg-green-400 rounded hover:bg-green-300 transition-colors disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Tournament"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
