import { useEffect, useRef } from "react";

/**
 * Navigable move list displayed as paired moves.
 * @param {Array} history - [{fen, san, from, to}, ...] from parsePgnFull (index 0 = start position)
 * @param {number} currentIndex - Currently viewed position index in history
 * @param {function} onNavigate - Called with new index
 */
export default function MoveList({ history, currentIndex, onNavigate }) {
  const activeRef = useRef(null);

  useEffect(() => {
    if (activeRef.current) {
      activeRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [currentIndex]);

  if (!history || history.length <= 1) {
    return <div className="text-xs text-slate-500 p-3">No moves yet...</div>;
  }

  // Pair moves: [{number, whiteIdx, blackIdx}, ...]
  const pairs = [];
  for (let i = 1; i < history.length; i += 2) {
    pairs.push({
      number: Math.ceil(i / 2),
      whiteIdx: i,
      blackIdx: i + 1 < history.length ? i + 1 : null,
    });
  }

  return (
    <div className="overflow-y-auto flex-1 p-2">
      <div className="grid grid-cols-[2rem_1fr_1fr] gap-y-0.5 text-xs">
        {pairs.map((pair) => (
          <div key={pair.number} className="contents">
            <span className="text-slate-600 text-right pr-1 tabular-nums py-0.5">
              {pair.number}.
            </span>
            <button
              ref={currentIndex === pair.whiteIdx ? activeRef : null}
              onClick={() => onNavigate(pair.whiteIdx)}
              className={`text-left px-1.5 py-0.5 rounded font-mono transition-colors ${
                currentIndex === pair.whiteIdx
                  ? "bg-blue-600/30 text-white"
                  : "text-slate-300 hover:bg-slate-700/40"
              }`}
            >
              {history[pair.whiteIdx].san}
            </button>
            {pair.blackIdx !== null ? (
              <button
                ref={currentIndex === pair.blackIdx ? activeRef : null}
                onClick={() => onNavigate(pair.blackIdx)}
                className={`text-left px-1.5 py-0.5 rounded font-mono transition-colors ${
                  currentIndex === pair.blackIdx
                    ? "bg-blue-600/30 text-white"
                    : "text-slate-300 hover:bg-slate-700/40"
                }`}
              >
                {history[pair.blackIdx].san}
              </button>
            ) : (
              <span />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
