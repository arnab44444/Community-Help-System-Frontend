import { createBrowserRouter } from "react-router";
import Layout from "../components/Layout";
import DashboardLayout from "../components/DashboardLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import AboutUs from "../pages/AboutUs";
import Motivation from "../pages/Motivation";
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
        path: "about-us",
        element: <AboutUs />,
      },
      {
        path: "motivation",
        element: <Motivation />,
      },
    ],
  },
  {
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "help-requests",
        element: <HelpRequests />,
      },
      {
        path: "create-request",
        element: <CreateRequest />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "transactions",
        element: <Transactions />,
      },
      {
        path: "my-activity",
        element: <MyActivity />,
      },
      {
        path: "admin-dashboard",
        element: <AdminDashboard />,
      },
      {
        path: "emergencies",
        element: <NgoEmergencies />,
      },
    ],
  },
]);

export default router;
