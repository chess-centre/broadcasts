import Link from "next/link";
import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import {
  Monitor,
  Radio,
  Wifi,
  Clock,
  BarChart3,
  Users,
  Zap,
  Globe,
  Github,
  Download,
  ChevronRight,
  Play,
  Shield,
  Tv,
} from "lucide-react";

const features = [
  {
    icon: Radio,
    title: "Real-Time Broadcasting",
    desc: "Every move broadcasts instantly via WebSocket. Spectators see moves, clocks, and evaluations the moment they happen.",
  },
  {
    icon: Monitor,
    title: "Up to 20 Boards",
    desc: "Run a full congress or major event. Every board gets its own live feed, evaluation bar, and clock display.",
  },
  {
    icon: BarChart3,
    title: "Stockfish Analysis",
    desc: "Built-in engine evaluations with multi-PV lines, win probability, and per-player accuracy percentages.",
  },
  {
    icon: Globe,
    title: "Internet Spectators",
    desc: "Share a link. Anyone in the world can watch the broadcast live in their browser via the cloud relay.",
  },
  {
    icon: Shield,
    title: "Fully Offline",
    desc: "Runs entirely on your local machine. No cloud dependency, no internet required for local viewing.",
  },
  {
    icon: Clock,
    title: "Live Clocks",
    desc: "DGT clock times displayed with smooth countdown between server updates for accurate time display.",
  },
  {
    icon: Tv,
    title: "OBS Integration",
    desc: "Dedicated OBS browser source widgets for individual boards, standings ticker, and leaderboards.",
  },
  {
    icon: Users,
    title: "Tournament Management",
    desc: "Round-robin, Swiss, or congress formats with automatic pairings and standings calculation.",
  },
  {
    icon: Zap,
    title: "Open Source",
    desc: "MIT licensed. Free forever. No accounts, no subscriptions, no vendor lock-in.",
  },
];

const steps = [
  {
    num: "01",
    title: "Download & Launch",
    desc: "Install the app for macOS, Windows, or Linux. The broadcast server starts automatically — no terminal required.",
  },
  {
    num: "02",
    title: "Connect Your Boards",
    desc: "Point to your DGT LiveChess output folder, or create a tournament with the built-in wizard.",
  },
  {
    num: "03",
    title: "Go Live",
    desc: 'Click "Open Live View" and share the spectator link. Every connected browser sees moves in real-time.',
  },
];

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06]">
        <div className="absolute inset-0 bg-[#0d1117]/80 backdrop-blur-xl" />
        <div className="relative max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
          <LogoMark />
          <div className="hidden md:flex items-center gap-8">
            <a
              href="#features"
              className="text-sm text-neutral-400 hover:text-white transition-colors"
            >
              Features
            </a>
            <a
              href="#demo"
              className="text-sm text-neutral-400 hover:text-white transition-colors"
            >
              Demo
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-neutral-400 hover:text-white transition-colors"
            >
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
      <section className="relative pt-32 pb-24 md:pt-44 md:pb-32 px-6">
        {/* Background effects */}
        <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_30%,black_10%,transparent_70%)]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-emerald-500/[0.07] rounded-full blur-[120px]" />

        <div className="relative max-w-4xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-xs font-medium text-emerald-400 bg-emerald-500/[0.08] border border-emerald-500/20 rounded-full animate-fade-in">
            <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
            Open Source &middot; Free Forever
          </div>

          {/* Headline */}
          <h1
            className="text-5xl sm:text-6xl md:text-8xl font-black tracking-tight leading-[1.05] mb-6 animate-slide-up"
          >
            Live Chess
            <br />
            <span className="gradient-text">Broadcasting</span>
            <br />
            Made Simple
          </h1>

          <p className="text-lg md:text-xl text-neutral-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in [animation-delay:200ms] opacity-0">
            Connect your DGT boards, hit start, and stream every move to
            spectators in real-time. No complicated setup. No subscriptions.
            Just chess.
          </p>

          {/* CTAs */}
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

          {/* Stats */}
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

      {/* Demo / Screenshot Section */}
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

          {/* App window mockup */}
          <div className="app-screenshot glow-green mx-auto max-w-4xl">
            <div className="app-screenshot-titlebar">
              <div className="app-screenshot-dot bg-[#ff5f57]" />
              <div className="app-screenshot-dot bg-[#febc2e]" />
              <div className="app-screenshot-dot bg-[#28c840]" />
              <span className="ml-3 text-xs text-neutral-500 font-mono">
                Chess Broadcast
              </span>
            </div>
            {/* Placeholder for screenshot/video */}
            <div className="relative aspect-video bg-surface-raised flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-4">
                  <Play className="w-8 h-8 text-emerald-400 ml-1" />
                </div>
                <p className="text-neutral-500 text-sm">
                  Demo video coming soon
                </p>
                <p className="text-neutral-600 text-xs mt-1">
                  Add a screenshot or Screen Studio recording here
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="group relative bg-white/[0.02] border border-white/[0.06] rounded-xl p-6 hover:bg-white/[0.04] hover:border-white/[0.1] transition-all duration-300"
              >
                <div className="w-10 h-10 rounded-lg bg-emerald-500/[0.08] border border-emerald-500/20 flex items-center justify-center mb-4">
                  <feature.icon className="w-5 h-5 text-emerald-400" />
                </div>
                <h3 className="text-base font-semibold mb-2 text-white">
                  {feature.title}
                </h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
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
        className="py-16 md:py-24 px-6 relative"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-emerald-500/[0.02] to-transparent" />
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
          <div className="space-y-8">
            {steps.map((item, i) => (
              <div
                key={item.num}
                className="flex gap-6 md:gap-8 items-start group"
              >
                <div className="relative shrink-0">
                  <span className="flex items-center justify-center w-12 h-12 rounded-xl bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-400 font-mono font-bold text-sm">
                    {item.num}
                  </span>
                  {i < steps.length - 1 && (
                    <div className="absolute top-12 left-1/2 -translate-x-1/2 w-px h-8 bg-gradient-to-b from-emerald-500/20 to-transparent" />
                  )}
                </div>
                <div className="pt-2">
                  <h3 className="text-lg font-semibold mb-1.5 text-white">
                    {item.title}
                  </h3>
                  <p className="text-neutral-400 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 md:py-24 px-6">
        <div className="max-w-3xl mx-auto text-center relative">
          <div className="absolute inset-0 bg-emerald-500/[0.04] rounded-3xl blur-xl" />
          <div className="relative bg-white/[0.02] border border-white/[0.06] rounded-3xl p-12 md:p-16">
            <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
              Ready to{" "}
              <span className="gradient-text">broadcast</span>?
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
                <a
                  href="https://github.com/chess-centre/broadcasts"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Github className="w-5 h-5" />
                  View on GitHub
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.06] py-8 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <div className="flex items-center gap-4">
            <LogoMark />
            <span className="hidden sm:inline text-neutral-600">|</span>
            <span>
              Open source under MIT
            </span>
          </div>
          <div className="flex gap-6">
            <a
              href="https://github.com/chess-centre/broadcasts"
              className="hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              GitHub
            </a>
            <Link
              href="/download"
              className="hover:text-white transition-colors"
            >
              Download
            </Link>
            <a
              href="https://chesscentre.online"
              className="hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              The Chess Centre
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}
