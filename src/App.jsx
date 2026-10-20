import React, { Suspense, lazy, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./layout/Layout";
import Loading from "@/components/Loading";
const Dashboard = lazy(() => import("./pages/dashboard"));
const Login = lazy(() => import("./pages/auth/login"));
const ForgotPassword = lazy(() => import("./pages/auth/forgot"));
const Profile = lazy(() => import("./pages/utility/profile"));
const Addadmin = lazy(() => import("./pages/Admin/addAdmin"));
const ViewAdmin = lazy(() => import("./pages/Admin/viewAdmin"));
const EditAdmin = lazy(() => import("./pages/Admin/editAdmin"));
const AddUser = lazy(() => import("./pages/User/addUser"));
const ViewUser = lazy(() => import("./pages/User/viewUser"));
const EditUser = lazy(() => import("./pages/User/editUser"));
const ApproveUser = lazy(() => import("./pages/User/approveUser"));
const EditCountry = lazy(() => import("./pages/Country/editCountry"));
const AddCountry = lazy(() => import("./pages/Country/addCountry"));
const ViewCountry = lazy(() => import("./pages/Country/viewCountry"));
const EditState = lazy(() => import("./pages/state/editState"));
const AddState = lazy(() => import("./pages/state/addState"));
const ViewState = lazy(() => import("./pages/state/viewState"));
const ViewVehicle = lazy(() => import("./pages/Vehicle-old/viewVehicle"));
const AddVehicle = lazy(() => import("./pages/Vehicle-old/addVehicle"));
const EditVehicle = lazy(() => import("./pages/Vehicle-old/editVehicle"));
const ViewCity = lazy(() => import("./pages/City/viewCity"));
const EditCity = lazy(() => import("./pages/City/editCity"));
const AddCity = lazy(() => import("./pages/City/addCity"));
const Settings = lazy(() => import("./pages/Settings/settings"));
const EmailConfig = lazy(() => import("./pages/Settings/emailConfig"));
const PaymentConfig = lazy(() => import("./pages/Settings/paymentConfig"));
const SmsConfig = lazy(() => import("./pages/Settings/smsConfig"));
const CmsPages = lazy(() => import("./pages/Cms/cmsPages"));
const EditCms = lazy(() => import("./pages/Cms/editCms"));
const Error = lazy(() => import("./pages/404"));

import {
  useQuery,
  useMutation,
  useQueryClient,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ToastContainer } from "react-toastify";
import Router from "./routes";
import { AdminProvider } from "./layout/AdminContext";

export const queryClient = new QueryClient();
const token = localStorage.getItem("token");



function App() {
  useEffect(() => { }, [queryClient]);
  return (
    <>
      <AdminProvider>
        <ToastContainer />

        <QueryClientProvider client={queryClient}>
          <main className="App relative">
            <Routes>
              <Route
                path="/"
                element={
                  <Suspense fallback={<Loading />}>
                    {token ? <Router /> : (<Login />)
                    }
                  </Suspense>
                }
              />
              <Route
                path="/forgot-password"
                element={
                  <Suspense fallback={<Loading />}>
                    <ForgotPassword />
                  </Suspense>
                }
              />
              <Route path="/*"
                element={
                  <Router />
                }
              />
              <Route
                path="/404"
                element={
                  <Suspense fallback={<Loading />}>
                    <Dashboard />
                  </Suspense>
                }
              />
            </Routes>
          </main>
        </QueryClientProvider>
      </AdminProvider>
    </>
  );
}

export default App;
