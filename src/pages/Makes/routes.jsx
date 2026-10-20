import React, { lazy } from "react";
import { useRoutes } from "react-router-dom";

const Makes = lazy(() => import("./viewMakes"));
const AddMakes = lazy(() => import("./addMakes"));
const EditMakes = lazy(() => import("./editMakes"));

export default function Router() {
  const routes = useRoutes([
    { path: '/', element: <Makes />, },
    { path: "add-makes", element: <AddMakes /> },
    { path: "edit-makes", element: <EditMakes /> },
  ]);
  return routes;
}