import { useNavigate } from "react-router-dom";
import ConfigDashboard from "../components/SimulatorPanel";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 font-mono">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xs text-gh-textMuted uppercase tracking-wider">chess broadcast system</h1>
        <button
          onClick={() => navigate("/live")}
          className="text-[10px] uppercase tracking-wider text-green-400 hover:text-green-300 transition-colors"
        >
          open live view &rarr;
        </button>
      </div>

      <ConfigDashboard />
    </div>
  );
}
