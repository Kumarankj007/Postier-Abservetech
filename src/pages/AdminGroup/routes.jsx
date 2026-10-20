import React, { lazy, Suspense } from "react";
import { Navigate, useRoutes } from "react-router-dom";

const AdminGroup = lazy(() => import("./viewAdminGroup"));
const AddAdminGroup = lazy(() => import("./addAdminGroup"));
const EditAdminGroup = lazy(() => import("./editAdminGroup"));

export default function Router() {
  const routes = useRoutes([
    { path: '/', element: <AdminGroup /> },
    { path: "add-adminGroup", element: <AddAdminGroup /> },
    { path: "edit-adminGroup", element: <EditAdminGroup /> },
  ]);
  return routes;
}