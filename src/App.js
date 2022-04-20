import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ThemedSuspense from "./components/ThemedSuspense";
import routes from "./routes";
const Page404 = lazy(() => import("./pages/Error/404"));

export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<ThemedSuspense />}>
        <Routes>
          <Route path="*" element={<Page404 />} />
          {routes.map((route, index) => (
            <Route
              key={route.path + index}
              path={route.path}
              element={<route.element />}
            />
          ))}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
