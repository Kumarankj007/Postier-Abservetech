import React, { lazy } from "react";
import { useRoutes } from "react-router-dom";

const City = lazy(() => import("./viewCity")); 
const AddCity = lazy(() => import("./addCity")); 
const EditCity = lazy(() => import("./editCity"));

export default function Router() {
  const routes = useRoutes([
    { path: '/',element: <City />,},
    { path: "add-city", element: <AddCity /> },
    { path: "edit-city", element: <EditCity /> },
  ]);
  return routes;
}