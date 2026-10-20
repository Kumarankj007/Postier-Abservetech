import React, { lazy } from 'react';
import { useRoutes } from "react-router-dom";

const ViewDeliverParcel = lazy(() => import('./viewDeliverParcel'));
const AddDeliverParcel = lazy(() => import('./addDeliverParcel'));
const EditDeliverParcel = lazy(() => import('./editDeliverParcel'));

export default function Router() {
  const routes = useRoutes([
    { path: '/', element: <ViewDeliverParcel /> },
    { path: 'add-deliverParcel', element: <AddDeliverParcel /> },
    { path: 'edit-deliverparcel', element: <EditDeliverParcel /> },
  ]);

  return routes;
}
