import { RouteObject } from "react-router-dom";
import Layout from "./ui/Layout";
import Landing from "./views/Landing";
import Login from "./views/Login";
import Register from "./views/Register";
import Dashboard from "./views/Dashboard";
import Discover from "./views/Discover";
import SessionView from "./views/SessionView";
import Profile from "./views/Profile";
import Settings from "./views/Settings";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Landing /> },
      { path: "auth/login", element: <Login /> },
      { path: "auth/register", element: <Register /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "discover", element: <Discover /> },
      { path: "session/:id", element: <SessionView /> },
      { path: "settings", element: <Settings /> },
      { path: "profile/:id", element: <Profile /> },
    ],
  },
];

export default routes;
