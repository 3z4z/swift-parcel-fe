import { createBrowserRouter, Navigate } from "react-router";
import AuthLayout from "../layouts/AuthLayout";
import LoginPage from "../pages/auth/Login";
import RegisterPage from "../pages/auth/Register";
import DashboardLayout from "../layouts/DashboardLayout";
import DashboardHomePage from "../pages/dashboard/Home";
import PrivateRoute from "./PrivateRoute";
import AdminRoute from "./AdminRoute";
import ManageUsersPage from "../pages/admin/ManageUsers";
import AllOrdersPage from "../pages/admin/AllOrders";
import UserRoute from "./UserRoute";
import MyOrdersPage from "../pages/user/MyOrders";
import AddParcelPage from "../pages/user/AddParcel";
import ViewOrderPage from "../pages/user/ViewOrder";
import AgentRoute from "./AgentRoute";
import AssignedOrdersPage from "../pages/agent/AssignedOrders";

export const router = createBrowserRouter([
  {
    path: "",
    Component: DashboardLayout,
    children: [
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
      {
        index: true,
        element: (
          <PrivateRoute>
            <DashboardHomePage />
          </PrivateRoute>
        ),
      },

      // admin routes
      {
        path: "manage-users",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <ManageUsersPage />
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "all-orders",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <AllOrdersPage />
            </AdminRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "all-orders/:id",
        element: (
          <PrivateRoute>
            <AdminRoute>
              <ViewOrderPage />
            </AdminRoute>
          </PrivateRoute>
        ),
      },

      // user routes
      {
        path: "add-parcel",
        element: (
          <PrivateRoute>
            <UserRoute>
              <AddParcelPage />
            </UserRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "my-orders",
        element: (
          <PrivateRoute>
            <UserRoute>
              <MyOrdersPage />
            </UserRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "my-orders/:id",
        element: (
          <PrivateRoute>
            <UserRoute>
              <ViewOrderPage />
            </UserRoute>
          </PrivateRoute>
        ),
      },

      // agent routes
      {
        path: "assigned-orders",
        element: (
          <PrivateRoute>
            <AgentRoute>
              <AssignedOrdersPage />
            </AgentRoute>
          </PrivateRoute>
        ),
      },
      {
        path: "assigned-orders/:id",
        element: (
          <PrivateRoute>
            <AgentRoute>
              <ViewOrderPage />
            </AgentRoute>
          </PrivateRoute>
        ),
      },
    ],
  },
]);
