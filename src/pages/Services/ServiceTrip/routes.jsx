import React, { lazy } from 'react'
import { useRoutes } from 'react-router-dom';

const ViewServiceType = lazy(() => import('./viewServiceType'))
const AddServiceType = lazy(() => import('./addServiceType'))
const EditServiceType = lazy(() => import('./editServiceType'))
export default function Router() {
    const routes = useRoutes([
        { path: '/', element: <ViewServiceType /> },
        { path: 'add-servicetype', element: <AddServiceType /> },
        { path: 'view-servicetype', element: <EditServiceType /> },
    ])
    return (routes)
}
