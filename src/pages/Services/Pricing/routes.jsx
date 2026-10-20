import React, { lazy } from 'react'
import { useRoutes } from 'react-router-dom';

const ViewPricing = lazy(() => import('./viewPricing'))
const AddPricing = lazy(() => import('./addPricing'))
const EditPricing = lazy(() => import('./editPricing'))
export default function Router() {
    const routes = useRoutes([
        { path: '/', element: <ViewPricing /> },
        { path: 'add-Pricing', element: <AddPricing /> },
        { path: 'view-Pricing', element: <EditPricing /> },
    ])
    return (routes)
}
