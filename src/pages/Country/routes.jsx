import React, { lazy } from "react";
import { useRoutes } from "react-router-dom";

const Country = lazy(() => import("./viewCountry")); 
const AddCountry = lazy(() => import("./addCountry")); 
const EditCountry = lazy(() => import("./editCountry"));

export default function Router() {
  const routes = useRoutes([
    { path: '/',element: <Country />,},
    { path: "add-country", element: <AddCountry /> },
    { path: "edit-country", element: <EditCountry /> },
  ]);
  return routes;
}