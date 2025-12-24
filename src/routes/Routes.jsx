import { createBrowserRouter, Navigate } from "react-router";
import AuthLayout from "../layouts/AuthLayout";
import LoginPage from "../pages/auth/Login";
import RegisterPage from "../pages/auth/Register";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardHomePage from "../pages/dashboard/Home";

export const router = createBrowserRouter([
  {
    path: "",
    Component: DashboardLayout,
    children: [
      {
        index: true,
        Component: DashboardHomePage,
      },
    ],
  },
  {
    path: "auth",
    Component: AuthLayout,
    children: [
      {
        path: "login",
        Component: LoginPage,
      },
      {
        path: "register",
        Component: RegisterPage,
      },
      {
        index: true,
        element: <Navigate to={"login"} replace />,
      },
    ],
  },
]);
