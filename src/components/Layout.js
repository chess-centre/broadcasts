import { NavLink, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen bg-gh-bg font-mono">
      <header className="border-b border-gh-border bg-gh-surface/80">
        <div className="max-w-screen-2xl mx-auto px-4 h-10 flex items-center gap-4 text-xs">
          <NavLink to="/" className="text-gh-text hover:text-white transition-colors">
            broadcast
          </NavLink>
          <span className="text-gh-border">/</span>
          <NavLink
            to="/live"
            className={({ isActive }) =>
              `transition-colors ${isActive ? "text-green-400" : "text-gh-textMuted hover:text-gh-text"}`
            }
          >
            live
          </NavLink>
        </div>
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  );
}
