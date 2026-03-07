import { NavLink, Outlet } from "react-router-dom";
import { LogoMark } from "./Logo";

const navItems = [
  { to: "/", label: "Home", end: true },
  { to: "/tournament", label: "Tournament" },
  { to: "/live", label: "Live" },
];

export default function Layout() {
  return (
    <div className="min-h-screen bg-gh-bg font-mono">
      <header className="border-b border-gh-border bg-gh-surface/80 broadcast-header">
        <div className="max-w-screen-2xl mx-auto px-4 h-11 flex items-center gap-4">
          <NavLink to="/" className="shrink-0">
            <LogoMark />
          </NavLink>
          <div className="h-4 w-px bg-gh-border" />
          <nav className="flex items-center gap-3">
            {navItems.map(({ to, label, end }) => (
              <NavLink
                key={to}
                to={to}
                end={end}
                className={({ isActive }) =>
                  `text-xs transition-colors ${isActive ? "text-green-400" : "text-gh-textMuted hover:text-gh-text"}`
                }
              >
                {label}
              </NavLink>
            ))}
          </nav>
          <div className="flex-1" />
          <NavLink
            to="/guide"
            className={({ isActive }) =>
              `text-[10px] transition-colors ${isActive ? "text-green-400" : "text-gh-textMuted hover:text-gh-text"}`
            }
          >
            ?
          </NavLink>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
