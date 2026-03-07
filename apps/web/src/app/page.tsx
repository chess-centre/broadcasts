import Link from "next/link";
import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { NetworkAnimation } from "@/components/hero/network-animation";
import { DataFlowAnimation } from "@/components/hero/data-flow-animation";
import { ThemeSwitcher } from "@/components/showcase/theme-switcher";
import { EvalDemo } from "@/components/showcase/eval-demo";
import { CrosstableDemo } from "@/components/showcase/crosstable-demo";
import { BoardGridDemo } from "@/components/showcase/board-grid-demo";
import {
  Radio,
  Clock,
  BarChart3,
  Users,
  Globe,
  Github,
  Download,
  Play,
  Shield,
  Tv,
  Palette,
  Trophy,
  Zap,
  Monitor,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06]">
        <div className="absolute inset-0 bg-[#0a0d12]/80 backdrop-blur-xl" />
        <div className="relative max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
          <LogoMark />
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm text-neutral-400 hover:text-white transition-colors">
              Features
            </a>
            <a href="#demo" className="text-sm text-neutral-400 hover:text-white transition-colors">
              Demo
            </a>
            <a href="#how-it-works" className="text-sm text-neutral-400 hover:text-white transition-colors">
              Setup
            </a>
            <a
              href="https://github.com/chess-centre/broadcasts"
              className="text-sm text-neutral-400 hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
          </div>
          <Button asChild size="sm">
            <Link href="/download">
              <Download className="w-4 h-4" />
              <span className="hidden sm:inline">Download</span>
            </Link>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-32 px-6 overflow-hidden">
        {/* Network animation background */}
        <NetworkAnimation />

        {/* Grid overlay */}
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_80%_60%_at_50%_30%,black_10%,transparent_70%)]" />

        {/* Glow orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-500/[0.04] rounded-full blur-[180px]" />
        <div className="absolute top-10 right-1/3 w-[400px] h-[400px] bg-cyan-500/[0.03] rounded-full blur-[140px]" />

        {/* Horizontal scan line */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="hero-scanline" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-xs font-mono font-medium text-emerald-400 bg-emerald-500/[0.06] border border-emerald-500/20 rounded-full animate-fade-in backdrop-blur-sm">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-400" />
            </span>
            OPEN SOURCE &middot; FREE FOREVER
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.1] mb-8 animate-slide-up">
            <span className="text-white">Live chess,</span>
            <br />
            <span className="hero-gradient-text">broadcast everywhere.</span>
          </h1>

          <p className="text-sm md:text-base text-neutral-400 max-w-lg mx-auto mb-10 leading-relaxed animate-fade-in [animation-delay:200ms] opacity-0">
            Connect DGT boards. Stream moves, clocks, and engine analysis to
            any browser in real-time. Open source and free.
          </p>

          <div className="flex gap-4 justify-center flex-wrap animate-fade-in [animation-delay:400ms] opacity-0">
            <Button asChild size="lg" className="hero-btn-glow">
              <Link href="/download">
                <Download className="w-5 h-5" />
                Download
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="backdrop-blur-sm">
              <a href="#demo">
                <Play className="w-5 h-5" />
                Watch Demo
              </a>
            </Button>
          </div>

          {/* Stats */}
          <div className="flex gap-8 md:gap-12 justify-center mt-14 animate-fade-in [animation-delay:600ms] opacity-0">
            {[
              { value: "20+", label: "boards" },
              { value: "<100ms", label: "latency" },
              { value: "Free", label: "forever" },
            ].map((stat) => (
              <div key={stat.label} className="text-center group">
                <span className="text-lg md:text-2xl font-semibold font-mono text-emerald-400 tabular-nums tracking-tight group-hover:text-cyan-400 transition-colors block">
                  {stat.value}
                </span>
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-600 mt-0.5 block">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Interactive Feature Showcases */}
      <section id="features" className="py-16 md:py-24 px-6 relative">
        <div className="absolute inset-0 overflow-hidden">
          <DataFlowAnimation direction="horizontal" />
        </div>
        <div className="relative max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-mono font-medium text-emerald-400 uppercase tracking-widest px-3 py-1 bg-emerald-500/[0.08] rounded mb-4">
              Features
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Built for{" "}
              <span className="hero-gradient-text">the board</span>
            </h2>
            <p className="text-neutral-500 mt-4 max-w-xl mx-auto font-mono text-sm">
              Professional-grade broadcasting tools.
              Customisable. Real-time. Free.
            </p>
          </div>

          {/* Showcase 1: Board Themes & Customisation */}
          <div className="showcase-card p-5 md:p-10 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-violet-500/[0.1] border border-violet-500/20 flex items-center justify-center">
                <Palette className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Fully Customisable
                </h3>
                <p className="text-sm text-neutral-500">
                  6 board themes, 5 accent colors, and dozens of display options
                </p>
              </div>
            </div>
            <ThemeSwitcher />
          </div>

          {/* Showcase 2 + 3: Engine Analysis & Multi-board grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <div className="showcase-card p-5 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/[0.1] border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-white">
                    Engine Analysis
                  </h3>
                  <p className="text-sm text-neutral-500">
                    Stockfish 16 with multi-PV lines
                  </p>
                </div>
              </div>
              <EvalDemo />
            </div>

            <div className="showcase-card p-5 md:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-blue-500/[0.1] border border-blue-500/20 flex items-center justify-center shrink-0">
                  <Monitor className="w-5 h-5 text-blue-400" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-white">
                    Multi-Board View
                  </h3>
                  <p className="text-sm text-neutral-500">
                    Up to 20 boards with featured board
                  </p>
                </div>
              </div>
              <BoardGridDemo />
            </div>
          </div>

          {/* Showcase 4: Tournament / Crosstable */}
          <div className="showcase-card p-5 md:p-10 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-amber-500/[0.1] border border-amber-500/20 flex items-center justify-center">
                <Trophy className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Tournament Management
                </h3>
                <p className="text-sm text-neutral-500">
                  Live crosstable, standings, and automatic pairings for Round Robin & Swiss
                </p>
              </div>
            </div>
            <CrosstableDemo />
          </div>

          {/* Feature grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { icon: Radio, title: "Real-Time", desc: "WebSocket broadcasting with sub-100ms latency", color: "emerald" },
              { icon: Clock, title: "Live Clocks", desc: "DGT clock integration with smooth countdown", color: "cyan" },
              { icon: Globe, title: "Online Spectators", desc: "Cloud relay lets anyone watch via browser", color: "blue" },
              { icon: Shield, title: "Fully Offline", desc: "No internet needed for local broadcasts", color: "violet" },
              { icon: Tv, title: "OBS Integration", desc: "Browser source widgets for streaming", color: "rose" },
              { icon: Users, title: "Social Posts", desc: "Auto-generated results for social media", color: "amber" },
              { icon: Zap, title: "Critical Moments", desc: "Blunder and brilliancy detection badges", color: "red" },
              { icon: Monitor, title: "TV Mode", desc: "Auto-cycling kiosk display for venues", color: "teal" },
            ].map((feature) => {
              const colorMap: Record<string, { bg: string; border: string; text: string }> = {
                emerald: { bg: "bg-emerald-500/[0.08]", border: "border-emerald-500/20", text: "text-emerald-400" },
                cyan: { bg: "bg-cyan-500/[0.08]", border: "border-cyan-500/20", text: "text-cyan-400" },
                blue: { bg: "bg-blue-500/[0.08]", border: "border-blue-500/20", text: "text-blue-400" },
                violet: { bg: "bg-violet-500/[0.08]", border: "border-violet-500/20", text: "text-violet-400" },
                rose: { bg: "bg-rose-500/[0.08]", border: "border-rose-500/20", text: "text-rose-400" },
                amber: { bg: "bg-amber-500/[0.08]", border: "border-amber-500/20", text: "text-amber-400" },
                red: { bg: "bg-red-500/[0.08]", border: "border-red-500/20", text: "text-red-400" },
                teal: { bg: "bg-teal-500/[0.08]", border: "border-teal-500/20", text: "text-teal-400" },
              };
              const c = colorMap[feature.color] || colorMap.emerald;

              return (
                <div key={feature.title} className="showcase-card p-5">
                  <div className={`w-9 h-9 rounded-lg ${c.bg} border ${c.border} flex items-center justify-center mb-3`}>
                    <feature.icon className={`w-4 h-4 ${c.text}`} />
                  </div>
                  <h3 className="text-sm font-semibold text-white mb-1">{feature.title}</h3>
                  <p className="text-xs text-neutral-500 leading-relaxed">{feature.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Demo Video */}
      <section id="demo" className="py-16 md:py-24 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-mono font-medium text-emerald-400 uppercase tracking-widest px-3 py-1 bg-emerald-500/[0.08] rounded mb-4">
              Demo
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              See it <span className="hero-gradient-text">in action</span>
            </h2>
          </div>

          <div className="app-screenshot glow-green mx-auto max-w-4xl">
            <div className="app-screenshot-titlebar">
              <div className="app-screenshot-dot bg-[#ff5f57]" />
              <div className="app-screenshot-dot bg-[#febc2e]" />
              <div className="app-screenshot-dot bg-[#28c840]" />
              <span className="ml-3 text-xs text-neutral-500 font-mono">
                Chess Broadcast
              </span>
            </div>
            <video
              className="w-full block bg-[#0d1117]"
              src="/demo.mp4"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        </div>
      </section>

      <div className="section-divider max-w-5xl mx-auto" />

      {/* How it works */}
      <section id="how-it-works" className="py-16 md:py-24 px-6 relative">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black_10%,transparent_70%)] opacity-50" />
        <div className="absolute inset-0 overflow-hidden">
          <DataFlowAnimation direction="vertical" />
        </div>
        <div className="relative max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-mono font-medium text-emerald-400 uppercase tracking-widest px-3 py-1 bg-emerald-500/[0.08] rounded mb-4">
              Setup
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Three steps to{" "}
              <span className="hero-gradient-text">go live</span>
            </h2>
          </div>

          <div className="space-y-0">
            {[
              { num: "01", title: "Download & Launch", desc: "Install for macOS or Windows. The embedded server starts automatically.", icon: ">" },
              { num: "02", title: "Connect Your Boards", desc: "Point to your DGT LiveChess output folder, or create a tournament with the built-in wizard.", icon: ">>" },
              { num: "03", title: "Go Live", desc: "Share the spectator link. Moves, clocks, and engine analysis stream to every browser in real-time.", icon: ">>>" },
            ].map((item, i) => (
              <div key={item.num} className="flex gap-5 md:gap-6 items-start group relative">
                <div className="relative shrink-0 flex flex-col items-center">
                  <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/[0.02] border border-white/[0.06] text-emerald-400 font-mono font-bold text-sm group-hover:border-emerald-500/40 group-hover:bg-emerald-500/[0.04] transition-all duration-500 group-hover:shadow-[0_0_20px_rgba(52,211,153,0.1)]">
                    {item.num}
                  </span>
                  {i < 2 && (
                    <div className="w-px h-8 bg-gradient-to-b from-emerald-500/20 to-transparent mt-1" />
                  )}
                </div>
                <div className="pt-2.5 pb-6">
                  <h3 className="text-base font-semibold mb-1 text-white font-mono flex items-center gap-2">
                    {item.title}
                    <span className="text-emerald-500/30 text-xs font-normal hidden md:inline">{item.icon}</span>
                  </h3>
                  <p className="text-sm text-neutral-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Architecture diagram */}
          <div className="mt-12 p-6 rounded-xl bg-white/[0.01] border border-white/[0.04] font-mono text-xs text-neutral-500">
            <div className="flex items-center gap-2 mb-3 text-emerald-400/60 text-[10px] uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/40" />
              Data Pipeline
            </div>
            <div className="hidden md:flex items-center justify-center gap-3 text-neutral-400">
              <span className="px-3 py-1.5 rounded bg-white/[0.03] border border-white/[0.06] text-white/70">DGT Board</span>
              <span className="text-emerald-500/50">&rarr;</span>
              <span className="px-3 py-1.5 rounded bg-white/[0.03] border border-white/[0.06] text-white/70">PGN File</span>
              <span className="text-emerald-500/50">&rarr;</span>
              <span className="px-3 py-1.5 rounded bg-emerald-500/[0.06] border border-emerald-500/20 text-emerald-400">Broadcast Server</span>
              <span className="text-emerald-500/50">&rarr;</span>
              <span className="px-3 py-1.5 rounded bg-white/[0.03] border border-white/[0.06] text-white/70">Stockfish</span>
              <span className="text-cyan-500/50">&rarr;</span>
              <span className="px-3 py-1.5 rounded bg-cyan-500/[0.06] border border-cyan-500/20 text-cyan-400">WebSocket</span>
              <span className="text-cyan-500/50">&rarr;</span>
              <span className="px-3 py-1.5 rounded bg-white/[0.03] border border-white/[0.06] text-white/70">Spectators</span>
            </div>
            {/* Mobile: vertical pipeline */}
            <div className="flex md:hidden flex-col items-center gap-1.5 text-neutral-400">
              {[
                { label: "DGT Board", highlight: false },
                { label: "PGN File", highlight: false },
                { label: "Broadcast Server", highlight: "emerald" as const },
                { label: "Stockfish", highlight: false },
                { label: "WebSocket", highlight: "cyan" as const },
                { label: "Spectators", highlight: false },
              ].map((item, i, arr) => (
                <div key={item.label} className="flex flex-col items-center">
                  <span className={`px-3 py-1.5 rounded text-xs ${
                    item.highlight === "emerald"
                      ? "bg-emerald-500/[0.06] border border-emerald-500/20 text-emerald-400"
                      : item.highlight === "cyan"
                        ? "bg-cyan-500/[0.06] border border-cyan-500/20 text-cyan-400"
                        : "bg-white/[0.03] border border-white/[0.06] text-white/70"
                  }`}>{item.label}</span>
                  {i < arr.length - 1 && (
                    <span className="text-emerald-500/50 text-[10px] my-0.5">&darr;</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-3xl mx-auto text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/[0.03] via-cyan-500/[0.04] to-indigo-500/[0.03] rounded-3xl blur-xl" />
          <div className="relative showcase-card p-8 md:p-16 overflow-hidden">
            {/* Corner accents */}
            <div className="absolute top-0 left-0 w-16 h-px bg-gradient-to-r from-emerald-500/40 to-transparent" />
            <div className="absolute top-0 left-0 w-px h-16 bg-gradient-to-b from-emerald-500/40 to-transparent" />
            <div className="absolute bottom-0 right-0 w-16 h-px bg-gradient-to-l from-cyan-500/40 to-transparent" />
            <div className="absolute bottom-0 right-0 w-px h-16 bg-gradient-to-t from-cyan-500/40 to-transparent" />

            <h2 className="text-3xl md:text-4xl font-extrabold mb-4 tracking-tight">
              Ready to <span className="hero-gradient-text">broadcast</span>?
            </h2>
            <p className="text-neutral-500 mb-8 max-w-md mx-auto font-mono text-sm">
              Free. Open source. macOS &amp; Windows.
              <br />
              Broadcasting in under 60 seconds.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button asChild size="lg" className="hero-btn-glow">
                <Link href="/download">
                  <Download className="w-5 h-5" />
                  Download
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg" className="backdrop-blur-sm">
                <a href="https://github.com/chess-centre/broadcasts" target="_blank" rel="noopener noreferrer">
                  <Github className="w-5 h-5" />
                  Source Code
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-4">
            <LogoMark />
            <span className="hidden sm:inline text-neutral-700">|</span>
            <span>Open source under MIT</span>
          </div>
          <div className="flex gap-6">
            <a href="https://github.com/chess-centre/broadcasts" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
              GitHub
            </a>
            <Link href="/download" className="hover:text-white transition-colors">
              Download
            </Link>
            <a href="https://chesscentre.online" className="hover:text-white transition-colors" target="_blank" rel="noopener noreferrer">
              The Chess Centre
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
