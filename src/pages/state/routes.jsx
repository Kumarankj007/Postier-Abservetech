import React, { lazy } from "react";
import { useRoutes } from "react-router-dom";

const State = lazy(() => import("./viewState")); 
const AddState = lazy(() => import("./addState")); 
const EditState = lazy(() => import("./editState"));

export default function Router() {
  const routes = useRoutes([
    { path: '/',element: <State />},
    { path: "add-state", element: <AddState /> },
    { path: "edit-state", element: <EditState /> },
  ]);
  return routes;
}