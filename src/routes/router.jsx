import { createBrowserRouter } from "react-router";
import Layout from "../components/Layout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import HelpRequests from "../pages/HelpRequests";
import Profile from "../pages/Profile";
import Transactions from "../pages/Transactions";
import CreateRequest from "../pages/CreateRequest";

import MyActivity from "../pages/MyActivity";
import AdminDashboard from "../pages/AdminDashboard";
import NgoEmergencies from "../pages/NgoEmergencies";
import PrivateRoute from "../provider/PrivateRoute";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "dashboard",
        element: (
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "help-requests",
        element: (
          <PrivateRoute>
            <HelpRequests />
          </PrivateRoute>
        ),
      },
      {
        path: "create-request",
        element: (
          <PrivateRoute>
            <CreateRequest />
          </PrivateRoute>
        ),
      },
      {
        path: "profile",
        element: (
          <PrivateRoute>
            <Profile />
          </PrivateRoute>
        ),
      },
      {
        path: "transactions",
        element: (
          <PrivateRoute>
            <Transactions />
          </PrivateRoute>
        ),
      },
      {
        path: "my-activity",
        element: (
          <PrivateRoute>
            <MyActivity />
          </PrivateRoute>
        ),
      },
      {
        path: "admin-dashboard",
        element: (
          <PrivateRoute>
            <AdminDashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "emergencies",
        element: (
          <PrivateRoute>
            <NgoEmergencies />
          </PrivateRoute>
        ),
      },
    ],
  },
]);

export default router;
