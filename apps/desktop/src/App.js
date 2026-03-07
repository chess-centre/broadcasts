import { lazy, Suspense, useState } from "react";
import { HashRouter, BrowserRouter, Routes, Route } from "react-router-dom";
import ThemedSuspense from "./components/ThemedSuspense";
import Layout from "./components/Layout";
import WelcomeWizard, { useWelcomeWizard } from "./components/WelcomeWizard";

const Home = lazy(() => import("./pages/Home"));
const LiveBroadcast = lazy(() => import("./pages/LiveBroadcast"));
const TournamentDashboard = lazy(() => import("./pages/TournamentDashboard"));
const Guide = lazy(() => import("./pages/Guide"));
const Page404 = lazy(() => import("./pages/Error/404"));
const OBSWidget = lazy(() => import("./pages/OBSWidget"));

// Electron serves from file:// which requires HashRouter
const isElectron = window.electronAPI?.isElectron;
const Router = isElectron ? HashRouter : BrowserRouter;

function AppContent() {
  const { showWelcome, markComplete } = useWelcomeWizard();
  const [welcomeDismissed, setWelcomeDismissed] = useState(false);

  const showWelcomeWizard = showWelcome && !welcomeDismissed;

  return (
    <>
      {showWelcomeWizard && (
        <WelcomeWizard
          onComplete={() => {
            markComplete();
            setWelcomeDismissed(true);
          }}
        />
      )}
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/tournament" element={<TournamentDashboard />} />
          <Route path="/live" element={<LiveBroadcast />} />
          <Route path="/guide" element={<Guide />} />
        </Route>
        <Route path="/obs" element={<OBSWidget />} />
        <Route path="*" element={<Page404 />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <Router>
      <Suspense fallback={<ThemedSuspense />}>
        <AppContent />
      </Suspense>
    </Router>
  );
}
