import React, { lazy } from "react";
import { useRoutes } from "react-router-dom";

const Vehicle = lazy(() => import("./viewVehicle")); 
const AddVehicle = lazy(() => import("./addVehicle")); 
const EditVehicle = lazy(() => import("./editVehicle"));

export default function Router() {
  const routes = useRoutes([
    { path: '/',element: <Vehicle />,},
    { path: "add-vehicle", element: <AddVehicle /> },
    { path: "edit-vehicle", element: <EditVehicle /> },
  ]);
  return routes;
}