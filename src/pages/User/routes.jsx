import React, { lazy } from "react";
import { useRoutes } from "react-router-dom";

const User = lazy(() => import("./viewUser")); 
const AddUser = lazy(() => import("./addUser")); 
const EditUser = lazy(() => import("./editUser"));
const DocUser = lazy(() => import("./userDocuments"))

export default function Router() {
  const routes = useRoutes([
    { path: '/',element: <User />,},
    { path: "add-user", element: <AddUser /> },
    { path: "edit-user", element: <EditUser /> },
    { path: "doc-user", element: <DocUser />}
  ]);
  return routes;
}