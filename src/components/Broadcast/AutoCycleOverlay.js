import GameViewerModal from "../Viewer/GameViewerModal";
import LiveLeaderboard from "../Shared/LiveLeaderboard";

export default function AutoCycleOverlay({ currentBoard, showLeaderboard, onStop }) {
  if (showLeaderboard) {
    return (
      <div className="fixed inset-0 z-50 bg-gh-bg flex flex-col items-center justify-center">
        <div className="w-96">
          <LiveLeaderboard />
        </div>
        <button
          onClick={onStop}
          className="fixed top-4 right-4 text-slate-500 hover:text-white text-xs transition-colors"
        >
          Exit TV Mode
        </button>
      </div>
    );
  }

  if (currentBoard !== null) {
    return <GameViewerModal board={currentBoard} onClose={onStop} />;
  }

  return null;
}
