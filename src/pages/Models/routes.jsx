import React, { lazy } from "react";
import { useRoutes } from "react-router-dom";

const Models = lazy(() => import("./viewModels"));
const AddModels = lazy(() => import("./addModels"));
const EditModels = lazy(() => import("./editModels"));

export default function Router() {
  const routes = useRoutes([
    { path: '/', element: <Models />, },
    { path: "add-Models", element: <AddModels /> },
    { path: "edit-Models", element: <EditModels /> },
  ]);
  return routes;
}