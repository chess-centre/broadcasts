import { lazy } from "react";

const routes = [
  {
    path: "/",
    element: lazy(() => import("./pages/Home")),
  },
  {
    path: "/festival",
    element: lazy(() => import("./pages/Festival")),
  },
  {
    path: "/games",
    element: lazy(() => import("./pages/Games")),
  },
  {
    path: "/swiss/:eventId",
    element: lazy(() => import("./pages/Swiss")),
  },
  {
    path: "/robin",
    element: lazy(() => import("./pages/Robin")),
  },
  {
    path: "/swiss",
    element: lazy(() => import("./pages/Swiss")),
  },
  {
    path: "/create",
    element: lazy(() => import("./pages/Manager/Create")),
  },
  {
    path: "/update/:eventId",
    element: lazy(() => import("./pages/Manager/Update")),
  },
  {
    path: "/match",
    element: lazy(() => import("./pages/Match")),
    path: "/lightning",
    element: lazy(() => import("./pages/Lightning")),
  },
  {
    path: "/congress",
    element: lazy(() => import("./pages/Congress")),
  }
];

export default routes;
