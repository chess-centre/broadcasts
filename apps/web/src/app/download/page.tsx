import Link from "next/link";
import { LogoMark } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Apple, Monitor, Github, ArrowLeft, ExternalLink } from "lucide-react";

const platforms = [
  {
    name: "macOS",
    format: ".dmg",
    icon: Apple,
    description: "macOS 10.15+ (Intel & Apple Silicon)",
    filename: "Chess-Broadcast-{version}-arm64.dmg",
  },
  {
    name: "Windows",
    format: ".exe",
    icon: Monitor,
    description: "Windows 10 or later",
    filename: "Chess-Broadcast-Setup-{version}.exe",
  },
  {
    name: "Linux",
    format: ".AppImage",
    icon: Monitor,
    description: "Ubuntu, Fedora, and other distributions",
    filename: "Chess-Broadcast-{version}-amd64.AppImage",
  },
];

export default function DownloadPage() {
  return (
    <main className="min-h-screen">
      {/* Nav */}
      <nav className="fixed top-0 left-0 right-0 z-50 border-b border-white/[0.06]">
        <div className="absolute inset-0 bg-[#0d1117]/80 backdrop-blur-xl" />
        <div className="relative max-w-6xl mx-auto flex items-center justify-between px-6 h-16">
          <Link href="/">
            <LogoMark />
          </Link>
        </div>
      </nav>

      <div className="pt-32 pb-24 px-6">
        <div className="max-w-2xl mx-auto">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm text-neutral-500 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to home
          </Link>

          <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-3">
            Download{" "}
            <span className="gradient-text">Chess Broadcast</span>
          </h1>
          <p className="text-neutral-400 mb-10">
            Latest release &middot; Requires DGT LiveChess 2.2+ for
            physical board integration
          </p>

          <div className="space-y-3">
            {platforms.map((p) => (
              <a
                key={p.name}
                href="https://github.com/chess-centre/broadcasts/releases/latest"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-5 p-5 bg-white/[0.02] border border-white/[0.06] rounded-xl hover:bg-white/[0.04] hover:border-emerald-500/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-lg bg-emerald-500/[0.08] border border-emerald-500/20 flex items-center justify-center shrink-0">
                  <p.icon className="w-6 h-6 text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-white">
                      {p.name}
                    </span>
                    <span className="font-mono text-[10px] text-neutral-500 bg-white/[0.04] px-2 py-0.5 rounded">
                      {p.format}
                    </span>
                  </div>
                  <span className="text-sm text-neutral-500 block mt-0.5">
                    {p.description}
                  </span>
                </div>
                <ExternalLink className="w-4 h-4 text-neutral-600 group-hover:text-emerald-400 transition-colors shrink-0" />
              </a>
            ))}
          </div>

          <div className="mt-10 flex items-center gap-6 text-sm">
            <a
              href="https://github.com/chess-centre/broadcasts"
              className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Github className="w-4 h-4" />
              View source on GitHub
            </a>
            <a
              href="https://github.com/chess-centre/broadcasts/releases"
              className="inline-flex items-center gap-2 text-neutral-400 hover:text-white transition-colors"
              target="_blank"
              rel="noopener noreferrer"
            >
              All releases
            </a>
          </div>
        </div>
      </div>
    </main>
  );
}
