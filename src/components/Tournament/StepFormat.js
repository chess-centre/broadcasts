const inputClass =
  "bg-gh-bg border border-gh-border text-gh-text font-mono text-xs rounded px-2 py-1 focus:border-blue-500 focus:outline-none";

export default function StepFormat({ data, onChange }) {
  const handleFormatChange = (format) => {
    const n = data.players.length;
    let rounds;
    if (format === "round-robin") {
      rounds = n % 2 === 0 ? n - 1 : n;
    } else {
      rounds = Math.max(1, Math.ceil(Math.log2(n || 2)));
    }
    onChange({ format, rounds });
  };

  const boardsPerRound = Math.floor(data.players.length / 2);

  return (
    <div className="space-y-3">
      <div>
        <label className="block text-[10px] uppercase tracking-wider text-gh-textMuted mb-1">
          Format
        </label>
        <div className="flex gap-2">
          {[
            { id: "round-robin", label: "Round Robin" },
            { id: "swiss", label: "Swiss" },
          ].map((fmt) => (
            <button
              key={fmt.id}
              onClick={() => handleFormatChange(fmt.id)}
              className={`px-3 py-1.5 text-xs rounded border transition-colors ${
                data.format === fmt.id
                  ? "border-blue-500 bg-blue-600/20 text-blue-400"
                  : "border-gh-border text-gh-textMuted hover:text-gh-text hover:border-slate-500"
              }`}
            >
              {fmt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="w-24">
        <label className="block text-[10px] uppercase tracking-wider text-gh-textMuted mb-1">
          Rounds
        </label>
        <input
          type="number"
          min={1}
          max={20}
          value={data.rounds}
          onChange={(e) => onChange({ rounds: Math.max(1, parseInt(e.target.value) || 1) })}
          className={inputClass}
        />
      </div>

      <div className="text-[10px] text-gh-textMuted">
        {data.format === "round-robin"
          ? `Round robin with ${data.players.length} players = ${data.rounds} rounds, ${boardsPerRound} boards per round`
          : `Swiss with ${data.players.length} players = ${data.rounds} rounds recommended`}
      </div>
    </div>
  );
}
