import { Fragment, useState, useMemo } from "react";
import { Transition } from "@headlessui/react";
import { usePGN } from "../../hooks/usePgn";
import { generateGameEndPost, generateStandingsPost, generateRoundSummary } from "../../utils/social";

function surname(fullName) {
  if (!fullName) return "?";
  const parts = fullName.trim().split(/\s+/);
  return parts.length > 1 ? parts[parts.length - 1] : fullName;
}

function PostCard({ text, onCopy }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-gh-bg/50 rounded px-3 py-2 border border-gh-border/30">
      <p className="text-xs text-gh-text whitespace-pre-wrap font-mono leading-relaxed">{text}</p>
      <div className="mt-1.5 flex justify-end">
        <button
          onClick={handleCopy}
          className={`text-[10px] px-2 py-0.5 rounded transition-colors ${
            copied ? "text-green-400" : "text-slate-400 hover:text-white bg-slate-800"
          }`}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
}

export default function SocialFeed({ open, onClose }) {
  const { games, currentRound } = usePGN();
  const [manualPosts, setManualPosts] = useState([]);

  // Auto-generate posts for finished games
  const gamePosts = useMemo(() => {
    const posts = [];
    games.forEach((game, boardNum) => {
      if (game.gameResult && game.gameResult !== "*") {
        const post = generateGameEndPost(game, boardNum);
        if (post) posts.push({ ...post, key: `game-${boardNum}` });
      }
    });
    return posts;
  }, [games]);

  const handleStandingsPost = () => {
    // Calculate standings from games
    const scores = new Map();
    games.forEach((game) => {
      [game.whiteInfo, game.blackInfo].forEach((info) => {
        if (info?.name && !scores.has(info.name)) {
          scores.set(info.name, { name: info.name, score: 0, played: 0 });
        }
      });
    });
    games.forEach((game) => {
      const r = game.gameResult;
      if (!r || r === "*") return;
      const w = scores.get(game.whiteInfo?.name);
      const b = scores.get(game.blackInfo?.name);
      if (!w || !b) return;
      w.played++; b.played++;
      if (r === "1-0") w.score++;
      else if (r === "0-1") b.score++;
      else if (r === "1/2-1/2") { w.score += 0.5; b.score += 0.5; }
    });
    const standings = Array.from(scores.values()).sort((a, b) => b.score - a.score);
    const post = generateStandingsPost(standings, "", currentRound);
    setManualPosts((prev) => [{ ...post, key: `standings-${Date.now()}` }, ...prev]);
  };

  const handleRoundSummary = () => {
    const post = generateRoundSummary(games, currentRound);
    setManualPosts((prev) => [{ ...post, key: `round-${Date.now()}` }, ...prev]);
  };

  const allPosts = [...manualPosts, ...gamePosts];

  return (
    <>
      {/* Backdrop */}
      <Transition
        show={open}
        as={Fragment}
        enter="transition-opacity duration-200"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />
      </Transition>

      {/* Panel */}
      <Transition
        show={open}
        as={Fragment}
        enter="transition-transform duration-250 ease-out"
        enterFrom="translate-x-full"
        enterTo="translate-x-0"
        leave="transition-transform duration-200 ease-in"
        leaveFrom="translate-x-0"
        leaveTo="translate-x-full"
      >
        <div className="fixed right-0 top-0 bottom-0 w-80 bg-gh-surface border-l border-gh-border z-50 overflow-y-auto shadow-2xl flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gh-border flex-shrink-0">
            <span className="text-sm font-semibold text-slate-200">Social Posts</span>
            <button
              onClick={onClose}
              className="text-slate-500 hover:text-slate-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Generate buttons */}
          <div className="px-4 py-3 border-b border-gh-border/50 flex gap-2 flex-shrink-0">
            <button
              onClick={handleStandingsPost}
              className="px-2.5 py-1 text-[10px] bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition-colors"
            >
              Standings
            </button>
            <button
              onClick={handleRoundSummary}
              className="px-2.5 py-1 text-[10px] bg-slate-700 text-slate-300 rounded hover:bg-slate-600 transition-colors"
            >
              Round Summary
            </button>
          </div>

          {/* Posts feed */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
            {allPosts.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">
                Posts will appear here as games finish.
              </p>
            ) : (
              allPosts.map((post) => <PostCard key={post.key} text={post.text} />)
            )}
          </div>
        </div>
      </Transition>
    </>
  );
}
