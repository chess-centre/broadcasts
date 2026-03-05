const PALETTE = [
  "bg-blue-600", "bg-emerald-600", "bg-amber-600", "bg-rose-600",
  "bg-purple-600", "bg-cyan-600", "bg-orange-600", "bg-indigo-600",
];

function getInitials(name) {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  return parts[0][0].toUpperCase();
}

function getColor(name) {
  if (!name) return PALETTE[0];
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = name.charCodeAt(i) + ((hash << 5) - hash);
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

export default function PlayerAvatar({ name }) {
  return (
    <div
      className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white flex-shrink-0 ${getColor(name)}`}
    >
      {getInitials(name)}
    </div>
  );
}
