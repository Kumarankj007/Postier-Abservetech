import React, { lazy } from 'react'
import { useRoutes } from 'react-router-dom';

const ViewLanguages = lazy(() => import('./viewLanguages'))
const AddLanguages = lazy(() => import('./addLanguages'))
const EditLanguages = lazy(() => import('./editLanguages'))
export default function Router() {
    const routes = useRoutes([
        { path: '/', element: <ViewLanguages /> },
        { path: 'add-Languages', element: <AddLanguages /> },
        { path: 'edit-Languages', element: <EditLanguages /> },
    ])
    return (routes)
}
