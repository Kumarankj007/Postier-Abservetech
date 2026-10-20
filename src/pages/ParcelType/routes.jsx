import React, { lazy } from "react";
import { useRoutes } from "react-router-dom";

const ViewParcelType = lazy(() => import("./viewParcelType"));
const AddParcelType = lazy(() => import("./addParcelType"));
const EditParcelType = lazy(() => import("./editParcelType"));

export default function Router() {
    const routes = useRoutes([
        { path: '/', element: <ViewParcelType /> },
        { path: 'add-parcelType', element: <AddParcelType /> },
        { path: 'edit-parcelType', element: <EditParcelType /> },
    ]);

    return routes;
}