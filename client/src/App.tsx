import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import { useGetSession } from "@/services/session.service";

import { DashboardShell } from "@/components/shells/layout-shell";
import { Toaster } from "@/components/ui/toaster";
const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const FarmAddPage = lazy(() => import("@/pages/FarmAddPage"));
const FarmAreaPage = lazy(() => import("@/pages/FarmAreaPage"));
const FarmersPage = lazy(() => import("@/pages/FarmersPage"));
const FarmPage = lazy(() => import("@/pages/FarmPage"));
const MortgagesPage = lazy(() => import("@/pages/MortgagesPage"));
const ReportsPage = lazy(() => import("@/pages/ReportsPage"));
const SignInPage = lazy(() => import("@/pages/SignInPage"));
const UsersPage = lazy(() => import("@/pages/UsersPage"));

function Loader() {
  return <>Loading...</>;
}

function App() {
  const { data, isLoading } = useGetSession();

  if (isLoading) {
    return <Loader />;
  }

  const routes = createBrowserRouter([
    {
      index: true,
      element: (
        <Suspense fallback={<Loader />}>
          <SignInPage activeUser={data} />
        </Suspense>
      ),
    },
    {
      path: "/dashboard",
      element: !data ? <Navigate to={"/"} /> : <DashboardShell />,
      children: [
        {
          index: true,
          element: (
            <Suspense fallback={<Loader />}>
              <DashboardPage />
            </Suspense>
          ),
        },
        {
          path: "farmers",
          element: (
            <Suspense fallback={<Loader />}>
              <FarmersPage />
            </Suspense>
          ),
        },
        {
          path: "farms",
          element: (
            <Suspense fallback={<Loader />}>
              <FarmPage />
            </Suspense>
          ),
        },
        {
          path: "farms/add",
          element: (
            <Suspense fallback={<Loader />}>
              <FarmAddPage />
            </Suspense>
          ),
        },
        {
          path: "farms/:farmId",
          element: (
            <Suspense fallback={<Loader />}>
              <FarmAreaPage />
            </Suspense>
          ),
        },
        {
          path: "mortgages",
          element: (
            <Suspense fallback={<Loader />}>
              <MortgagesPage />
            </Suspense>
          ),
        },
        {
          path: "reports",
          element: (
            <Suspense fallback={<Loader />}>
              <ReportsPage />
            </Suspense>
          ),
        },
        {
          path: "users",
          element: (
            <Suspense fallback={<Loader />}>
              {" "}
              <UsersPage />
            </Suspense>
          ),
        },
      ],
    },
  ]);

  return (
    <>
      <RouterProvider router={routes} />
      <Toaster />
    </>
  );
}

export default App;
