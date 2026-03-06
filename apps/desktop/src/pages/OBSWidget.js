import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { PGNProvider } from "../hooks/usePgn";
import { BroadcastSettingsProvider } from "../context/BroadcastSettingsContext";
import OBSBoardWidget from "../components/OBS/OBSBoardWidget";
import OBSStandingsWidget from "../components/OBS/OBSStandingsWidget";
import OBSTickerWidget from "../components/OBS/OBSTickerWidget";

function OBSWidgetContent() {
  const [params] = useSearchParams();
  const type = params.get("type") || "board";
  const board = params.get("board") || "1";
  const round = params.get("round") || "1";
  const bg = params.get("bg");

  // Set transparent or custom background
  useEffect(() => {
    document.body.classList.add("obs-widget-root");
    if (bg) {
      document.body.style.backgroundColor = bg;
    } else {
      document.body.style.backgroundColor = "transparent";
    }
    return () => {
      document.body.classList.remove("obs-widget-root");
      document.body.style.backgroundColor = "";
    };
  }, [bg]);

  switch (type) {
    case "board":
      return <OBSBoardWidget board={board} round={round} />;
    case "featured":
      return <OBSBoardWidget round={round} featured />;
    case "standings":
      return <OBSStandingsWidget round={round} />;
    case "ticker":
      return <OBSTickerWidget round={round} />;
    default:
      return (
        <div className="p-4 text-white text-xs font-mono">
          <p>OBS Widget - Unknown type: {type}</p>
          <p className="text-slate-400 mt-2">
            Valid types: board, featured, standings, ticker
          </p>
        </div>
      );
  }
}

export default function OBSWidget() {
  return (
    <PGNProvider>
      <BroadcastSettingsProvider>
        <OBSWidgetContent />
      </BroadcastSettingsProvider>
    </PGNProvider>
  );
}
