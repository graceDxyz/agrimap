import SignInPage from "@/pages/SignInPage";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";
import { useGetSession } from "./services/session.service";
import { DashboardShell } from "./components/shells/layout-shell";
import DashboardPage from "./pages/DashboardPage";

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
      ],
    },
  ]);

  return <RouterProvider router={routes} />;
}

export default App;
