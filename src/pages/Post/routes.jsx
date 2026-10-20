import React, { lazy } from "react";
import { useRoutes } from "react-router-dom";

const Post = lazy(() => import("./viewPost"));
const AddPost = lazy(() => import("./addPost"));
const EditPost = lazy(() => import("./editPost"));

export default function Router() {
  const routes = useRoutes([
    { path: '/', element: <Post />, },
    { path: "add-post", element: <AddPost /> },
    { path: "view-post", element: <EditPost /> },
  ]);
  return routes;
}