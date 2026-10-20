import React, { lazy } from "react";
import { useRoutes } from "react-router-dom";

const Rating = lazy(() => import("./viewRating"));
const AddRating = lazy(() => import("./addRating"));
const EditRating = lazy(() => import("./editRating"));

export default function Router() {
  const routes = useRoutes([
    { path: '/', element: <Rating />, },
    { path: "add-rating", element: <AddRating /> },
    { path: "edit-rating", element: <EditRating /> },
  ]);
  return routes;
}