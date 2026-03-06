export default function StepReview({ data }) {
  return (
    <div className="space-y-2 text-xs">
      <div className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
        <span className="text-gh-textMuted">Event</span>
        <span className="text-gh-text">{data.event || "---"}</span>
        <span className="text-gh-textMuted">Date</span>
        <span className="text-gh-text">{data.date}</span>
        <span className="text-gh-textMuted">Venue</span>
        <span className="text-gh-text">{data.venue || "---"}</span>
        <span className="text-gh-textMuted">Time Control</span>
        <span className="text-gh-text">{data.timeControl}</span>
        <span className="text-gh-textMuted">Format</span>
        <span className="text-gh-text capitalize">{data.format.replace("-", " ")}</span>
        <span className="text-gh-textMuted">Rounds</span>
        <span className="text-gh-text">{data.rounds}</span>
        <span className="text-gh-textMuted">Players</span>
        <span className="text-gh-text">{data.players.length}</span>
        <span className="text-gh-textMuted">Boards/round</span>
        <span className="text-gh-text">{Math.floor(data.players.length / 2)}</span>
      </div>

      <div className="border-t border-gh-border/50 pt-2 mt-2">
        <span className="text-[10px] text-gh-textMuted uppercase tracking-wider">Players</span>
        <div className="mt-1 space-y-0.5 max-h-32 overflow-y-auto">
          {data.players.map((p, i) => (
            <div key={i} className="flex items-center gap-2 text-[11px]">
              <span className="text-gh-textMuted w-4 text-right">{i + 1}</span>
              <span className="text-gh-text">{p.name}</span>
              {p.rating && <span className="text-gh-textMuted">{p.rating}</span>}
            </div>
          ))}
        </div>
      </div>

      <p className="text-[10px] text-gh-textMuted mt-2">
        This will create {data.rounds} round directories with PGN files for each pairing.
      </p>
    </div>
  );
}
