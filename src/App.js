import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ThemedSuspense from "./components/ThemedSuspense";
import Layout from "./components/Layout";

const Home = lazy(() => import("./pages/Home"));
const LiveBroadcast = lazy(() => import("./pages/LiveBroadcast"));
const Page404 = lazy(() => import("./pages/Error/404"));
const OBSWidget = lazy(() => import("./pages/OBSWidget"));

export default function App() {
  return (
    <BrowserRouter>
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
    </BrowserRouter>
  );
}
