import { lazy, Suspense } from "react";
import { HashRouter, BrowserRouter, Routes, Route } from "react-router-dom";
import ThemedSuspense from "./components/ThemedSuspense";
import Layout from "./components/Layout";

const Home = lazy(() => import("./pages/Home"));
const LiveBroadcast = lazy(() => import("./pages/LiveBroadcast"));
const Page404 = lazy(() => import("./pages/Error/404"));
const OBSWidget = lazy(() => import("./pages/OBSWidget"));

// Electron serves from file:// which requires HashRouter
const isElectron = window.electronAPI?.isElectron;
const Router = isElectron ? HashRouter : BrowserRouter;

export default function App() {
  return (
    <Router>
      <Suspense fallback={<ThemedSuspense />}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/live" element={<LiveBroadcast />} />
          </Route>
          <Route path="/obs" element={<OBSWidget />} />
          <Route path="*" element={<Page404 />} />
        </Routes>
      </Suspense>
    </Router>
  );
}
