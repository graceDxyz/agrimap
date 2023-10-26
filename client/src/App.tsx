import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import { useGetSession } from "@/services/session.service";

import { DashboardShell } from "@/components/shells/layout-shell";
import { Toaster } from "@/components/ui/toaster";
import Loader from "@/components/Loader";

const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const FarmAddPage = lazy(() => import("@/pages/FarmAddPage"));
const FarmAreaPage = lazy(() => import("@/pages/FarmAreaPage"));
const FarmersPage = lazy(() => import("@/pages/FarmersPage"));
const FarmPage = lazy(() => import("@/pages/FarmPage"));
const MortgagesPage = lazy(() => import("@/pages/MortgagesPage"));
const ReportsPage = lazy(() => import("@/pages/ReportsPage"));
const SignInPage = lazy(() => import("@/pages/SignInPage"));
const UsersPage = lazy(() => import("@/pages/UsersPage"));
const MapPage = lazy(() => import("@/pages/MapPage"));
const DisbursementsPage = lazy(() => import("@/pages/DisbursementsPage"));

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
            <Suspense fallback={<Loader heading="Dashboard" />}>
              <DashboardPage />
            </Suspense>
          ),
        },
        {
          path: "map",
          element: (
            <Suspense fallback={<Loader heading="Map" />}>
              <MapPage />
            </Suspense>
          ),
        },
        {
          path: "farmers",
          element: (
            <Suspense fallback={<Loader heading="Farmers" />}>
              <FarmersPage />
            </Suspense>
          ),
        },
        {
          path: "farms",
          element: (
            <Suspense fallback={<Loader heading="Farms" />}>
              <FarmPage />
            </Suspense>
          ),
        },
        {
          path: "farms/add",
          element: (
            <Suspense fallback={<Loader heading="Farms" />}>
              <FarmAddPage />
            </Suspense>
          ),
        },
        {
          path: "farms/:farmId",
          element: (
            <Suspense fallback={<Loader heading="Farms" />}>
              <FarmAreaPage />
            </Suspense>
          ),
        },
        {
          path: "farms/:farmId/edit",
          element: (
            <Suspense fallback={<Loader heading="Farms" />}>
              <FarmAreaPage />
            </Suspense>
          ),
        },
        {
          path: "land-status",
          element: (
            <Suspense fallback={<Loader heading="Land status" />}>
              <MortgagesPage />
            </Suspense>
          ),
        },
        {
          path: "disbursements",
          element: (
            <Suspense fallback={<Loader heading="Disbursements" />}>
              <DisbursementsPage />
            </Suspense>
          ),
        },
        {
          path: "reports",
          element: (
            <Suspense fallback={<Loader heading="Users" />}>
              <ReportsPage />
            </Suspense>
          ),
        },
        {
          path: "users",
          element: (
            <Suspense fallback={<Loader heading="Users" />}>
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
