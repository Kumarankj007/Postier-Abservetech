import React, { lazy } from 'react'
import { useRoutes } from 'react-router-dom';

const ViewTrips = lazy(() => import('./viewTrips'))
const AddTrips = lazy(() => import('./addTrips'))
const EditTrips = lazy(() => import('./editTrips'))
const EditPost = lazy(() => import("../Post/editPost"));
export default function Router() {
    const routes = useRoutes([
        { path: '/', element: <ViewTrips /> },
        { path: 'add-trip', element: <AddTrips /> },
        { path: 'edit-trips', element: <EditTrips /> },
        { path: "view-trip/view-post", element: <EditPost /> },
    ])
    return (routes)
}
