import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate, useRoutes } from "react-router-dom";
import Layout from "./layout/Layout";
import Loading from "@/components/Loading";

const AdminRoute = lazy(() => import("./pages/Admin/routes"));
const UserRoute = lazy(() => import("./pages/User/routes"));
const PostRoute = lazy(() => import("./pages/Post/routes"))
const TripsRoute = lazy(() => import("./pages/Trip/routes"))
const ServiceTypeRoute = lazy(() => import("./pages/Services/ServiceTrip/routes"))
const PricingRoute = lazy(() => import("./pages/Services/Pricing/routes"))
const LanguagesRoute = lazy(() => import("./pages/Multilingual/Languages/routes"))
const TranslationsRoute = lazy(() => import("./pages/Multilingual/Translations/routes"))
const ParcelTypeRoute = lazy(() => import("./pages/ParcelType/routes"));
const DeliverParcelType = lazy(() => import("./pages/DeliverParcelType/routes"));
const AdminGroupRoute = lazy(() => import("./pages/AdminGroup/routes"));
const CountryRoute = lazy(() => import("./pages/Country/routes"));
const StateRoute = lazy(() => import("./pages/state/routes"));
const CityRoute = lazy(() => import("./pages/City/routes"));
const RatingRoute = lazy(() => import("./pages/Rating/routes"));
const VehicleRoute = lazy(() => import("./pages/Vehicle/routes"));
const MakesRoute = lazy(() => import("./pages/Makes/routes"));
const ModlesRoute = lazy(() => import("./pages/Models/routes"));

const Dashboard = lazy(() => import("./pages/dashboard"));
const Statistics = lazy(() => import("./pages/sites-statistics"));
// const PostRoute = lazy(() => import("./pages/Post/routes"));
const Login = lazy(() => import("./pages/auth/login"));
const ForgotPassword = lazy(() => import("./pages/auth/forgot"));
const ResetPassword = lazy(() => import("./pages/auth/reset"));
const Profile = lazy(() => import("./pages/utility/profile"));
const ApproveUser = lazy(() => import("./pages/User/approveUser"));
const Settings = lazy(() => import("./pages/Settings/settings"));
const EmailConfig = lazy(() => import("./pages/Settings/emailConfig"));
const GeneralConfig = lazy(() => import("./pages/Settings/generalConfig"));
const PaymentConfig = lazy(() => import("./pages/Settings/paymentConfig"));
const SmsConfig = lazy(() => import("./pages/Settings/smsConfig"));
const CmsPages = lazy(() => import("./pages/Cms/cmsPages"));
const EmailPages = lazy(() => import("./pages/EmailTemplate/routes"))
const EditCms = lazy(() => import("./pages/Cms/editCms"));
const AddCms = lazy(() => import("./pages/Cms/addCms"));


export default function Router() {
  const routes = useRoutes([
    {
      path: "/",
      element: <Layout />,
      children: [
        { path: "dashboard", element: <Dashboard /> },
        { path: "site-statistics", element: <Statistics /> },
        { path: "post", element: <PostRoute /> },
        { path: "profile", element: <Profile /> },
        { path: "admin/*", element: <AdminRoute /> },
        { path: "user/*", element: <UserRoute /> },
        { path: "trip/*", element: <TripsRoute /> },
        { path: "servicetype/*", element: <ServiceTypeRoute /> },
        { path: "pricing/*", element: <PricingRoute /> },
        { path: "languages/*", element: <LanguagesRoute /> },
        { path: "translations/*", element: <TranslationsRoute /> },
        { path: "post/*", element: <PostRoute /> },
        { path: "parcelType/*", element: <ParcelTypeRoute /> },
        { path: "deliverParcelType/*", element: <DeliverParcelType /> },
        { path: "adminGroup/*", element: <AdminGroupRoute /> },
        { path: "country/*", element: <CountryRoute /> },
        { path: "state/*", element: <StateRoute /> },
        { path: "city/*", element: <CityRoute /> },
        { path: "rating/*", element: <RatingRoute /> },
        { path: "vehicle/*", element: <VehicleRoute /> },
        { path: "makes/*", element: <MakesRoute /> },
        { path: "models/*", element: <ModlesRoute /> },
        { path: "approve-user", element: <ApproveUser /> },
        { path: "settings", element: <Settings /> },
        { path: "pages", element: <CmsPages /> },
        { path: "emailTemplate/*", element: <EmailPages /> },
        { path: "pages/edit-cms", element: <EditCms /> },
        { path: "pages/add-cms", element: <AddCms /> },
        { path: "settings/general-settings", element: <GeneralConfig /> },
        { path: "settings/email-configuration", element: <EmailConfig /> },
        { path: "settings/sms-configuration", element: <SmsConfig /> },
        {
          path: "settings/payment-gateway-configuration",
          element: <PaymentConfig />,
        },
        { path: "*", element: <Navigate to="dashboard" /> },
        { element: <Navigate to="login" />, index: true },
        { element: <Navigate to="forgot-password" />, index: true }
      ],
    },
    {
      path: "/",
      element: <Login />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />
    },
    {
      path: "/reset-password",
      element: <ResetPassword />
    }

  ]);
  return routes;
}

{

}
