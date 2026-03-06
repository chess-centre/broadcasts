import { lazy } from "react";

const routes = [
  {
    path: "/",
    element: lazy(() => import("./pages/Home")),
  },
  {
    path: "/live",
    element: lazy(() => import("./pages/LiveBroadcast")),
  },
];

export default routes;
