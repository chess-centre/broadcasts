import { useState } from "react";

const inputClass =
  "bg-gh-bg border border-gh-border text-gh-text font-mono text-xs rounded px-2 py-1 focus:border-blue-500 focus:outline-none";

export default function StepPlayers({ data, onChange }) {
  const [name, setName] = useState("");
  const [rating, setRating] = useState("");
  const [importText, setImportText] = useState("");
  const [showImport, setShowImport] = useState(false);

  const addPlayer = () => {
    if (!name.trim()) return;
    onChange({ players: [...data.players, { name: name.trim(), rating: rating.trim() || "" }] });
    setName("");
    setRating("");
  };

  const removePlayer = (index) => {
    onChange({ players: data.players.filter((_, i) => i !== index) });
  };

  const handleImport = () => {
    const lines = importText.split("\n").filter((l) => l.trim());
    const newPlayers = lines
      .map((line) => {
        const parts = line.split(/[,\t]+/).map((p) => p.trim());
        return { name: parts[0], rating: parts[1] || "" };
      })
      .filter((p) => p.name);
    onChange({ players: [...data.players, ...newPlayers] });
    setImportText("");
    setShowImport(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") addPlayer();
  };

  return (
    <div className="space-y-2">
      {/* Add player row */}
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <label className="block text-[10px] uppercase tracking-wider text-gh-textMuted mb-1">
            Name
          </label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`${inputClass} w-full`}
            placeholder="Player name"
          />
        </div>
        <div className="w-20">
          <label className="block text-[10px] uppercase tracking-wider text-gh-textMuted mb-1">
            Rating
          </label>
          <input
            value={rating}
            onChange={(e) => setRating(e.target.value)}
            onKeyDown={handleKeyDown}
            className={`${inputClass} w-full`}
            placeholder="1500"
          />
        </div>
        <button
          onClick={addPlayer}
          className="px-2.5 py-1 text-xs font-medium bg-green-400 text-black rounded hover:bg-green-300 transition-colors"
        >
          +
        </button>
      </div>

      {/* Import toggle */}
      <button
        onClick={() => setShowImport(!showImport)}
        className="text-[10px] text-blue-400 hover:text-blue-300 transition-colors"
      >
        {showImport ? "Hide import" : "Import from list"}
      </button>

      {showImport && (
        <div className="space-y-1">
          <textarea
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            className={`${inputClass} w-full h-20 resize-none`}
            placeholder={"Name, Rating\nMagnus Carlsen, 2882\nFabiano Caruana, 2804"}
          />
          <button
            onClick={handleImport}
            className="px-2.5 py-1 text-xs font-medium bg-blue-600 text-white rounded hover:bg-blue-500 transition-colors"
          >
            Import
          </button>
        </div>
      )}

      {/* Player list */}
      {data.players.length > 0 && (
        <div className="space-y-0.5 max-h-40 overflow-y-auto">
          {data.players.map((p, i) => (
            <div
              key={i}
              className="flex items-center justify-between text-[11px] px-2 py-0.5 bg-gh-bg/50 rounded"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-gh-textMuted w-4 text-right flex-shrink-0">{i + 1}</span>
                <span className="text-gh-text truncate">{p.name}</span>
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                {p.rating && <span className="text-gh-textMuted">{p.rating}</span>}
                <button
                  onClick={() => removePlayer(i)}
                  className="text-red-400 hover:text-red-300 transition-colors"
                >
                  &times;
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="text-[10px] text-gh-textMuted">{data.players.length} players</div>
    </div>
  );
}
