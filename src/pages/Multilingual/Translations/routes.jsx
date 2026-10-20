import React, { lazy } from 'react'
import { useRoutes } from 'react-router-dom';

const ViewTranslation = lazy(() => import('./viewTranslation'))
const EditTranslation = lazy(() => import('./editTranslation'))
export default function Router() {
    const routes = useRoutes([
        { path: '/', element: <ViewTranslation /> },
        { path: 'view-translation', element: <EditTranslation /> },
    ])
    return (routes)
}
