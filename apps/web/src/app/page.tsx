import Link from "next/link";
import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
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
            <a href="#demo" className="text-sm text-neutral-400 hover:text-white transition-colors">
              Demo
            </a>
            <a href="#features" className="text-sm text-neutral-400 hover:text-white transition-colors">
              Features
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
              Download
            </Link>
          </Button>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-20 md:pt-44 md:pb-28 px-6">
        <div className="absolute inset-0 bg-grid [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,black_10%,transparent_60%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-emerald-500/[0.05] rounded-full blur-[150px]" />
        <div className="absolute top-20 right-1/4 w-[400px] h-[400px] bg-cyan-500/[0.03] rounded-full blur-[120px]" />
        <div className="absolute top-40 left-1/4 w-[300px] h-[300px] bg-indigo-500/[0.03] rounded-full blur-[100px]" />

        <div className="relative max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-xs font-medium text-emerald-400 bg-emerald-500/[0.08] border border-emerald-500/20 rounded-full animate-fade-in">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Open Source &middot; Free Forever
          </div>

          <h1 className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight leading-[1.05] mb-6 animate-slide-up">
            Live Chess
            <br />
            <span className="gradient-text">Broadcasting</span>
            <br />
            Made Simple
          </h1>

          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in [animation-delay:200ms] opacity-0">
            Connect your DGT boards, hit start, and stream every move to
            spectators worldwide. Engine analysis, live clocks, tournament
            management &mdash; all in one app.
          </p>

          <div className="flex gap-4 justify-center flex-wrap animate-fade-in [animation-delay:400ms] opacity-0">
            <Button asChild size="lg">
              <Link href="/download">
                <Download className="w-5 h-5" />
                Download for Free
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <a href="#demo">
                <Play className="w-5 h-5" />
                See it in Action
              </a>
            </Button>
          </div>

          <div className="flex gap-8 md:gap-16 justify-center mt-16 animate-fade-in [animation-delay:600ms] opacity-0">
            {[
              { value: "20", label: "Simultaneous Boards" },
              { value: "<100ms", label: "Update Latency" },
              { value: "3", label: "Platforms" },
            ].map((stat) => (
              <div key={stat.label} className="text-center">
                <span className="block text-2xl md:text-3xl font-bold font-mono text-emerald-400">
                  {stat.value}
                </span>
                <span className="text-xs text-neutral-500 mt-1 block">
                  {stat.label}
                </span>
              </div>
            ))}
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
              See it in action
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
              className="w-full aspect-video bg-[#0d1117]"
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

      {/* Interactive Feature Showcases */}
      <section id="features" className="py-16 md:py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-mono font-medium text-emerald-400 uppercase tracking-widest px-3 py-1 bg-emerald-500/[0.08] rounded mb-4">
              Features
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Everything you need to
              <br />
              <span className="gradient-text">run a broadcast</span>
            </h2>
            <p className="text-neutral-400 mt-4 max-w-xl mx-auto">
              Professional broadcasting tools built for chess organisers.
              Customisable, real-time, and completely free.
            </p>
          </div>

          {/* Showcase 1: Board Themes & Customisation */}
          <div className="showcase-card p-8 md:p-10 mb-6">
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
            <div className="showcase-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-emerald-500/[0.1] border border-emerald-500/20 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
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

            <div className="showcase-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-blue-500/[0.1] border border-blue-500/20 flex items-center justify-center">
                  <Monitor className="w-5 h-5 text-blue-400" />
                </div>
                <div>
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
          <div className="showcase-card p-8 md:p-10 mb-6">
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

      <div className="section-divider max-w-5xl mx-auto" />

      {/* How it works */}
      <section id="how-it-works" className="py-16 md:py-24 px-6 relative">
        <div className="absolute inset-0 bg-dots [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,black_20%,transparent_70%)]" />
        <div className="relative max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <span className="inline-block text-xs font-mono font-medium text-emerald-400 uppercase tracking-widest px-3 py-1 bg-emerald-500/[0.08] rounded mb-4">
              Setup
            </span>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">
              Three steps to{" "}
              <span className="gradient-text">go live</span>
            </h2>
          </div>

          <div className="space-y-6">
            {[
              { num: "01", title: "Download & Launch", desc: "Install for macOS, Windows, or Linux. The broadcast server starts automatically." },
              { num: "02", title: "Connect Your Boards", desc: "Point to your DGT LiveChess output folder, or create a tournament with the built-in wizard." },
              { num: "03", title: "Go Live", desc: "Open the live view and share the spectator link. Every browser sees moves in real-time." },
            ].map((item, i) => (
              <div key={item.num} className="flex gap-5 md:gap-6 items-start group">
                <div className="relative shrink-0">
                  <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/[0.03] border border-white/[0.08] text-emerald-400 font-mono font-bold text-sm group-hover:border-emerald-500/30 transition-colors">
                    {item.num}
                  </span>
                  {i < 2 && (
                    <div className="absolute top-12 left-1/2 -translate-x-1/2 w-px h-6 bg-gradient-to-b from-white/[0.06] to-transparent" />
                  )}
                </div>
                <div className="pt-2.5">
                  <h3 className="text-base font-semibold mb-1 text-white">{item.title}</h3>
                  <p className="text-sm text-neutral-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-3xl mx-auto text-center relative">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/[0.03] via-cyan-500/[0.04] to-indigo-500/[0.03] rounded-3xl blur-xl" />
          <div className="relative showcase-card p-12 md:p-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Ready to <span className="gradient-text">broadcast</span>?
            </h2>
            <p className="text-neutral-400 mb-8 max-w-md mx-auto">
              Free, open source, and runs on macOS, Windows, and Linux.
              Download now and start broadcasting in minutes.
            </p>
            <div className="flex gap-4 justify-center flex-wrap">
              <Button asChild size="lg">
                <Link href="/download">
                  <Download className="w-5 h-5" />
                  Download for Free
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <a href="https://github.com/chess-centre/broadcasts" target="_blank" rel="noopener noreferrer">
                  <Github className="w-5 h-5" />
                  View on GitHub
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
