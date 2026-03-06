import Link from "next/link";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 backdrop-blur-xl bg-[var(--bg)]/80 border-b border-[var(--border)]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <span className="text-[var(--green)] font-bold text-lg font-mono">
            Chess Broadcast
          </span>
          <div className="flex items-center gap-8">
            <a href="#features" className="text-sm text-[var(--text-muted)] hover:text-white transition">
              Features
            </a>
            <a href="#how-it-works" className="text-sm text-[var(--text-muted)] hover:text-white transition">
              How It Works
            </a>
            <Link
              href="/download"
              className="text-sm font-semibold bg-[var(--green)] text-black px-5 py-2 rounded-lg hover:shadow-lg hover:shadow-[var(--green-glow)] transition"
            >
              Download
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-40 pb-24 px-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(var(--border)_1px,transparent_1px),linear-gradient(90deg,var(--border)_1px,transparent_1px)] bg-[size:60px_60px] opacity-20 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,black_20%,transparent_70%)]" />
        <div className="relative z-10 max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-xs font-medium text-[var(--green)] bg-[var(--green-subtle)] border border-[var(--green)]/20 rounded-full">
            <span className="w-2 h-2 bg-[var(--green)] rounded-full animate-pulse" />
            Open Source &middot; Free Forever
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[1.05] mb-6">
            Live Chess
            <br />
            <span className="gradient-text">Broadcasting</span>
            <br />
            Made Simple
          </h1>
          <p className="text-lg text-[var(--text-muted)] max-w-xl mx-auto mb-10 leading-relaxed">
            Connect your DGT boards. Hit start. Stream every move, clock, and
            evaluation to spectators in real-time. No complicated setup. No
            subscriptions.
          </p>
          <div className="flex gap-4 justify-center flex-wrap">
            <Link
              href="/download"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--green)] text-black font-semibold rounded-xl hover:shadow-xl hover:shadow-[var(--green-glow)] transition hover:-translate-y-0.5"
            >
              Download for Free
            </Link>
            <a
              href="#features"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--bg-elevated)] text-white font-semibold rounded-xl border border-[var(--border-light)] hover:bg-[var(--border)] transition hover:-translate-y-0.5"
            >
              Learn More
            </a>
          </div>
          <div className="flex gap-12 justify-center mt-16">
            <div className="text-center">
              <span className="block text-3xl font-bold font-mono text-[var(--green)]">
                20
              </span>
              <span className="text-xs text-[var(--text-dim)]">
                Simultaneous Boards
              </span>
            </div>
            <div className="text-center">
              <span className="block text-3xl font-bold font-mono text-[var(--green)]">
                &lt;100ms
              </span>
              <span className="text-xs text-[var(--text-dim)]">
                Update Latency
              </span>
            </div>
            <div className="text-center">
              <span className="block text-3xl font-bold font-mono text-[var(--green)]">
                3
              </span>
              <span className="text-xs text-[var(--text-dim)]">Platforms</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-mono font-medium text-[var(--green)] uppercase tracking-widest px-3 py-1 bg-[var(--green-subtle)] rounded mb-4">
              Features
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Everything you need to
              <br />
              <span className="gradient-text">run a broadcast</span>
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: "Real-Time Updates", desc: "Every move broadcasts instantly via WebSocket. Spectators see moves, clocks, and evaluations the moment they happen." },
              { title: "Up to 20 Boards", desc: "Run a full congress or major event. Every board gets its own live feed, evaluation bar, and clock display." },
              { title: "Stockfish Analysis", desc: "Built-in engine evaluations with multi-PV lines, win probability, and per-player accuracy percentages." },
              { title: "Internet Spectators", desc: "Share a link. Anyone in the world can watch the broadcast live in their browser via the cloud relay." },
              { title: "Fully Offline", desc: "Runs entirely on your local machine. No cloud dependency, no internet required for local viewing." },
              { title: "Tournament Management", desc: "Round-robin, Swiss, or congress formats with automatic pairings and standings calculation." },
              { title: "Live Clocks", desc: "DGT clock times displayed with smooth countdown between server updates for accurate time display." },
              { title: "OBS Integration", desc: "Dedicated OBS browser source widgets for individual boards, standings ticker, and leaderboards." },
              { title: "Open Source", desc: "MIT licensed. Free forever. No accounts, no subscriptions, no vendor lock-in." },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-[var(--bg-card)] border border-[var(--border)] rounded-2xl p-8 hover:border-[var(--border-light)] hover:-translate-y-1 transition-all"
              >
                <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed">
                  {feature.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section
        id="how-it-works"
        className="py-24 px-6 bg-gradient-to-b from-[var(--bg)] via-[var(--bg-card)] to-[var(--bg)]"
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-mono font-medium text-[var(--green)] uppercase tracking-widest px-3 py-1 bg-[var(--green-subtle)] rounded mb-4">
              Setup
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">
              Three steps to <span className="gradient-text">go live</span>
            </h2>
          </div>
          <div className="space-y-12">
            {[
              {
                step: "01",
                title: "Install & Launch",
                desc: "Download the app for your platform. Open it. The server starts automatically — no terminal, no configuration.",
              },
              {
                step: "02",
                title: "Connect Boards",
                desc: "Point to your DGT LiveChess output folder, or create a tournament with the built-in wizard.",
              },
              {
                step: "03",
                title: "Go Live",
                desc: "Click \"Open Live View\" and share the spectator link. Every connected browser sees moves in real-time.",
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-8 items-start">
                <span className="text-5xl font-extrabold font-mono text-[var(--border-light)] shrink-0">
                  {item.step}
                </span>
                <div>
                  <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                  <p className="text-[var(--text-muted)] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <div className="max-w-3xl mx-auto text-center bg-[var(--bg-card)] border border-[var(--border)] rounded-3xl p-16 relative overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(16,185,129,0.08),transparent_50%),radial-gradient(circle_at_80%_50%,rgba(139,92,246,0.06),transparent_50%)]" />
          <div className="relative">
            <h2 className="text-4xl font-extrabold mb-4">
              Ready to <span className="gradient-text">broadcast</span>?
            </h2>
            <p className="text-[var(--text-muted)] mb-8">
              Free, open source, and runs on all major platforms.
            </p>
            <Link
              href="/download"
              className="inline-flex items-center gap-2 px-8 py-4 bg-[var(--green)] text-black font-semibold rounded-xl hover:shadow-xl hover:shadow-[var(--green-glow)] transition"
            >
              Download for Free
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[var(--border)] py-8 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-xs text-[var(--text-dim)]">
          <span>
            Open source under MIT. Built by{" "}
            <a href="https://github.com/chess-centre" className="text-[var(--green)]">
              The Chess Centre
            </a>
          </span>
          <div className="flex gap-6">
            <a href="https://github.com/chess-centre/broadcasts" className="hover:text-white transition">
              GitHub
            </a>
            <Link href="/download" className="hover:text-white transition">
              Download
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}
