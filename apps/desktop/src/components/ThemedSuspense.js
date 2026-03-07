import { Logo } from "./Logo";

export default function ThemedSuspense() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gh-bg gap-6">
      <div className="relative">
        <div className="absolute inset-0 bg-emerald-500/20 rounded-3xl blur-xl animate-pulse" />
        <div className="relative animate-pulse">
          <Logo size={64} />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:0ms]" />
        <div className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:150ms]" />
        <div className="w-1 h-1 bg-emerald-400 rounded-full animate-bounce [animation-delay:300ms]" />
      </div>
    </div>
  );
}
