import { useMemo } from "react";
import { extractMoveTimes, formatTime } from "../../utils/move-times";

/**
 * Inline SVG bar chart showing time spent per move.
 * White bars go up from center, black bars go down.
 */
export default function MoveTimeChart({ pgn }) {
  const { white, black } = useMemo(() => extractMoveTimes(pgn), [pgn]);

  if (white.length === 0 && black.length === 0) return null;

  const maxMoves = Math.max(white.length, black.length);
  const maxTime = Math.max(...white, ...black, 1);

  const WIDTH = 240;
  const HEIGHT = 80;
  const HALF = HEIGHT / 2;
  const barWidth = Math.max(2, Math.min(8, (WIDTH - 20) / maxMoves));
  const gap = 1;

  return (
    <div className="px-3 py-2">
      <div className="text-[10px] text-slate-500 mb-1">Move Times</div>
      <svg
        viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
        className="w-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Center line */}
        <line
          x1="0" y1={HALF} x2={WIDTH} y2={HALF}
          stroke="#30363d" strokeWidth="0.5"
        />

        {/* White bars (upward from center) */}
        {white.map((t, i) => {
          const h = (t / maxTime) * (HALF - 2);
          const x = 10 + i * (barWidth + gap);
          return (
            <rect
              key={`w-${i}`}
              x={x}
              y={HALF - h}
              width={barWidth}
              height={h}
              fill="#e2e8f0"
              opacity={0.8}
              rx={0.5}
            >
              <title>White move {i + 2}: {formatTime(t)}</title>
            </rect>
          );
        })}

        {/* Black bars (downward from center) */}
        {black.map((t, i) => {
          const h = (t / maxTime) * (HALF - 2);
          const x = 10 + i * (barWidth + gap);
          return (
            <rect
              key={`b-${i}`}
              x={x}
              y={HALF}
              width={barWidth}
              height={h}
              fill="#64748b"
              opacity={0.8}
              rx={0.5}
            >
              <title>Black move {i + 2}: {formatTime(t)}</title>
            </rect>
          );
        })}
      </svg>
    </div>
  );
}
