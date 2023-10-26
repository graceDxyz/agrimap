import { useQueryClient } from "@tanstack/react-query";
import { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import {
  disbursementsLoader,
  farmersLoader,
  farmLoader,
  farmsLoader,
  mapLoader,
  mortgagesLoader,
  usersLoader,
} from "@/services/loader";
import { useGetSession } from "@/services/session.service";

import Loader from "@/components/Loader";
import { DashboardShell } from "@/components/shells/layout-shell";
import { Toaster } from "@/components/ui/toaster";
import { Page404 } from "./pages/Page404";

const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const FarmAddPage = lazy(() => import("@/pages/FarmAddPage"));
const FarmAreaPage = lazy(() => import("@/pages/FarmAreaPage"));
const FarmersPage = lazy(() => import("@/pages/FarmersPage"));
const FarmPage = lazy(() => import("@/pages/FarmPage"));
const MortgagesPage = lazy(() => import("@/pages/MortgagesPage"));
const SignInPage = lazy(() => import("@/pages/SignInPage"));
const UsersPage = lazy(() => import("@/pages/UsersPage"));
const MapPage = lazy(() => import("@/pages/MapPage"));
const DisbursementsPage = lazy(() => import("@/pages/DisbursementsPage"));

function App() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useGetSession();

  if (isLoading) {
    return <Loader isDefault />;
  }

  const token = data?.accessToken ?? "";

  const routes = createBrowserRouter(
    [
      {
        index: true,
        element: (
          <Suspense fallback={<Loader isDefault />}>
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
            loader: mapLoader({ token, queryClient }),
            element: (
              <Suspense fallback={<Loader heading="Map" />}>
                <MapPage />
              </Suspense>
            ),
          },
          {
            path: "farmers",
            loader: farmersLoader({ token, queryClient }),
            element: (
              <Suspense fallback={<Loader heading="Farmers" />}>
                <FarmersPage />
              </Suspense>
            ),
          },
          {
            path: "farms",
            loader: farmsLoader({ token, queryClient }),
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
            loader: farmLoader({ token, queryClient }),
            errorElement: <Page404 />,
            element: (
              <Suspense fallback={<Loader heading="Farms" />}>
                <FarmAreaPage />
              </Suspense>
            ),
          },
          {
            path: "farms/:farmId/edit",
            loader: farmLoader({ token, queryClient }),
            errorElement: <Page404 />,
            element: (
              <Suspense fallback={<Loader heading="Farms" />}>
                <FarmAreaPage />
              </Suspense>
            ),
          },
          {
            path: "land-status",
            loader: mortgagesLoader({ token, queryClient }),
            element: (
              <Suspense fallback={<Loader heading="Land status" />}>
                <MortgagesPage />
              </Suspense>
            ),
          },
          {
            path: "disbursements",
            loader: disbursementsLoader({ token, queryClient }),
            element: (
              <Suspense fallback={<Loader heading="Disbursements" />}>
                <DisbursementsPage />
              </Suspense>
            ),
          },
          {
            path: "users",
            loader: usersLoader({ token, queryClient }),
            element: (
              <Suspense fallback={<Loader heading="Users" />}>
                <UsersPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
    {},
  );

  return (
    <>
      <RouterProvider router={routes} />
      <Toaster />
    </>
  );
}

export default App;
