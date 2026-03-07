/**
 * Logo components matching the web landing page design.
 * King chess piece with broadcast signal arcs.
 */

export function Logo({ size = 32, className = "" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <rect x="8" y="8" width="48" height="48" rx="12" fill="#0d1117" stroke="#30363d" strokeWidth="1.5" />

      {/* Crown/King cross */}
      <path d="M32 16V22M29 19H35" stroke="#10b981" strokeWidth="2.5" strokeLinecap="round" />

      {/* King body */}
      <path
        d="M26 24C26 24 24 28 24 32C24 36 26 38 26 38H38C38 38 40 36 40 32C40 28 38 24 38 24H26Z"
        fill="#10b981"
        opacity="0.15"
        stroke="#10b981"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {/* Base */}
      <path
        d="M24 38H40L42 42H22L24 38Z"
        fill="#10b981"
        opacity="0.2"
        stroke="#10b981"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <rect x="21" y="42" width="22" height="4" rx="1" fill="#10b981" opacity="0.3" stroke="#10b981" strokeWidth="1.5" />

      {/* Broadcast signal arcs */}
      <path d="M14 50C14 50 10 44 10 32C10 20 14 14 14 14" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <path d="M50 14C50 14 54 20 54 32C54 44 50 50 50 50" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" opacity="0.4" />
      <path d="M18 46C18 46 15 41 15 32C15 23 18 18 18 18" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
      <path d="M46 18C46 18 49 23 49 32C49 41 46 46 46 46" stroke="#10b981" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" />
    </svg>
  );
}

export function LogoMark({ className = "" }) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <Logo size={24} />
      <span className="font-mono font-bold text-white tracking-tight text-sm">
        Chess Broadcast
      </span>
    </div>
  );
}

export function LogoIcon({ size = 16, className = "" }) {
  return <Logo size={size} className={className} />;
}
