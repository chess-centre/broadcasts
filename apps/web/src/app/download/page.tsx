import Link from "next/link";

const platforms = [
  { name: "macOS", format: ".dmg", icon: "apple" },
  { name: "Windows", format: ".exe", icon: "windows" },
  { name: "Linux", format: ".AppImage", icon: "linux" },
];

export default function DownloadPage() {
  return (
    <main className="min-h-screen pt-24 px-6">
      <div className="max-w-2xl mx-auto text-center">
        <Link
          href="/"
          className="text-sm text-[var(--text-dim)] hover:text-white transition mb-8 inline-block"
        >
          &larr; Back to home
        </Link>
        <h1 className="text-5xl font-black tracking-tight mb-4">
          Download <span className="gradient-text">Chess Broadcast</span>
        </h1>
        <p className="text-[var(--text-muted)] mb-12">
          v0.1.0 &middot; Requires DGT LiveChess 2.2+ for physical board
          integration.
        </p>

        <div className="grid gap-4">
          {platforms.map((p) => (
            <a
              key={p.name}
              href={`https://github.com/chess-centre/broadcasts/releases/latest`}
              className="flex items-center gap-6 p-6 bg-[var(--bg-card)] border border-[var(--border)] rounded-xl hover:border-[var(--green)] hover:-translate-y-0.5 transition-all group"
            >
              <div className="flex-1 text-left">
                <span className="text-xs text-[var(--text-dim)] block">
                  Download for
                </span>
                <span className="text-xl font-bold">{p.name}</span>
              </div>
              <span className="font-mono text-xs text-[var(--text-dim)] bg-[var(--bg)] px-3 py-1 rounded">
                {p.format}
              </span>
            </a>
          ))}
        </div>

        <p className="text-xs text-[var(--text-dim)] mt-8">
          <a
            href="https://github.com/chess-centre/broadcasts"
            className="text-[var(--green)] hover:underline"
          >
            View source on GitHub &rarr;
          </a>
        </p>
      </div>
    </main>
  );
}
