import { lazy } from "react";

const routes = [
  {
    path: "/",
    element: lazy(() => import("./pages/Home")),
  },
  {
    path: "/games",
    element: lazy(() => import("./pages/Games")),
  },
  {
    path: "/swiss",
    element: lazy(() => import("./pages/Swiss")),
  },
  {
    path: "/robin",
    element: lazy(() => import("./pages/Robin")),
  }
];

export default routes;
