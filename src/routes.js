import { lazy } from "react";

const routes = [
  {
    path: "/",
    element: lazy(() => import("./views/Home")),
  },
  {
    path: "/games",
    element: lazy(() => import("./views/Games")),
  },
  {
    path: "/swiss",
    element: lazy(() => import("./views/Swiss")),
  },
  {
    path: "/robin",
    element: lazy(() => import("./views/Robin")),
  }
];

export default routes;
