const inputClass =
  "bg-gh-bg border border-gh-border text-gh-text font-mono text-xs rounded px-2 py-1 focus:border-blue-500 focus:outline-none w-full";

export default function StepEventInfo({ data, onChange }) {
  return (
    <div className="space-y-2">
      <div>
        <label className="block text-[10px] uppercase tracking-wider text-gh-textMuted mb-1">
          Event Name
        </label>
        <input
          value={data.event}
          onChange={(e) => onChange({ event: e.target.value })}
          className={inputClass}
          placeholder="Club Championship 2026"
        />
      </div>
      <div className="grid grid-cols-2 gap-2">
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-gh-textMuted mb-1">
            Date
          </label>
          <input
            type="date"
            value={data.date}
            onChange={(e) => onChange({ date: e.target.value })}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-[10px] uppercase tracking-wider text-gh-textMuted mb-1">
            Time Control
          </label>
          <select
            value={data.timeControl}
            onChange={(e) => onChange({ timeControl: e.target.value })}
            className={inputClass}
          >
            <option value="90+30">90+30 (Classical)</option>
            <option value="45+15">45+15 (Rapid)</option>
            <option value="25+10">25+10 (Rapid)</option>
            <option value="15+5">15+5 (Rapid)</option>
            <option value="3+2">3+2 (Blitz)</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-[10px] uppercase tracking-wider text-gh-textMuted mb-1">
          Venue
        </label>
        <input
          value={data.venue}
          onChange={(e) => onChange({ venue: e.target.value })}
          className={inputClass}
          placeholder="Chess Centre"
        />
      </div>
    </div>
  );
}
