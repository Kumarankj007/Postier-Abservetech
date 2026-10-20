import React, { lazy } from 'react';
import { useRoutes } from "react-router-dom";

const ViewEmailTemplate = lazy(() => import('./emailTemplate'));
const EmailTemplateForm = lazy(() => import('./emailTemplateForm'));

export default function Router() {
    const routes = useRoutes([
        { path: '/', element: <ViewEmailTemplate /> },
        { path: 'email-TemplateForm', element: <EmailTemplateForm /> },
    ]);

    return routes;
}
