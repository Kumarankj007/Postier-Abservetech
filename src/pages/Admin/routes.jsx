import React, { lazy, Suspense } from "react";
import { Navigate, useRoutes } from "react-router-dom";

const Admin = lazy(() => import("./viewAdmin"));
const Addadmin = lazy(() => import("./addAdmin"));
const EditAdmin = lazy(() => import("./editAdmin"));

export default function Router() {
  const routes = useRoutes([
    { path: "/", element: <Admin /> },
    { path: "add-admin", element: <Addadmin /> },
    { path: "edit-admin", element: <EditAdmin /> },
    { path: "/*", element: <Navigate to="/404" /> },
  ]);
  return routes;
}
