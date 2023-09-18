import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import { DashboardShell } from "@/components/shells/layout-shell";
import DashboardPage from "@/pages/DashboardPage";
import FarmersPage from "@/pages/FarmersPage";
import LandsPage from "@/pages/LandsPage";
import ReportsPage from "@/pages/ReportsPage";
import SignInPage from "@/pages/SignInPage";
import UsersPage from "@/pages/UsersPage";
import { useGetSession } from "@/services/session.service";

function App() {
  const { data, isLoading } = useGetSession();

  if (isLoading) {
    return <>Loading...</>;
  }

  const routes = createBrowserRouter([
    {
      index: true,
      element: <SignInPage activeUser={data} />,
    },
    {
      path: "/dashboard",
      element: !data ? <Navigate to={"/"} /> : <DashboardShell />,
      children: [
        {
          index: true,
          element: <DashboardPage />,
        },
        {
          path: "farmers",
          element: <FarmersPage />,
        },
        {
          path: "lands",
          element: <LandsPage />,
        },
        {
          path: "reports",
          element: <ReportsPage />,
        },
        {
          path: "users",
          element: <UsersPage />,
        },
        {
          path: "logout",

          element: <div>Loading...</div>,
        },
      ],
    },
  ]);

  return <RouterProvider router={routes} />;
}

export default App;
