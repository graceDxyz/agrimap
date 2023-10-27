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

import ErrorElement from "@/components/elements/ErrorElement";
import LoaderElement from "@/components/elements/LoaderElement";
import { DashboardShell } from "@/components/shells/layout-shell";
import { Toaster } from "@/components/ui/toaster";

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
    return <LoaderElement variant="content" />;
  }

  const user = data?.user;
  const token = data?.accessToken ?? "";

  const routes = createBrowserRouter(
    [
      {
        index: true,
        element: (
          <Suspense fallback={<LoaderElement variant="auth" />}>
            <SignInPage activeUser={data} />
          </Suspense>
        ),
      },
      {
        path: "/dashboard",
        element: !user ? <Navigate to="/" /> : <DashboardShell />,
        children: [
          {
            index: true,
            element: (
              <Suspense fallback={<LoaderElement heading="Dashboard" />}>
                <DashboardPage />
              </Suspense>
            ),
          },
          {
            path: "map",
            loader: mapLoader({ token, queryClient }),
            errorElement: <ErrorElement />,
            element: (
              <Suspense fallback={<LoaderElement heading="Map" />}>
                <MapPage />
              </Suspense>
            ),
          },
          {
            path: "farmers",
            loader: farmersLoader({ token, queryClient }),
            errorElement: <ErrorElement />,
            element: (
              <Suspense fallback={<LoaderElement heading="Farmers" />}>
                <FarmersPage />
              </Suspense>
            ),
          },
          {
            path: "farms",
            loader: farmsLoader({ token, queryClient }),
            errorElement: <ErrorElement />,
            element: (
              <Suspense fallback={<LoaderElement heading="Farms" />}>
                <FarmPage />
              </Suspense>
            ),
          },
          {
            path: "farms/add",
            element: (
              <Suspense fallback={<LoaderElement heading="Farms" />}>
                <FarmAddPage />
              </Suspense>
            ),
          },
          {
            path: "farms/:farmId",
            loader: farmLoader({ token, queryClient }),
            errorElement: <ErrorElement />,
            element: (
              <Suspense fallback={<LoaderElement heading="Farms" />}>
                <FarmAreaPage />
              </Suspense>
            ),
          },
          {
            path: "farms/:farmId/edit",
            loader: farmLoader({ token, queryClient }),
            errorElement: <ErrorElement />,
            element: (
              <Suspense fallback={<LoaderElement heading="Farms" />}>
                <FarmAreaPage />
              </Suspense>
            ),
          },
          {
            path: "land-status",
            loader: mortgagesLoader({ token, queryClient }),
            errorElement: <ErrorElement />,
            element: (
              <Suspense fallback={<LoaderElement heading="Land status" />}>
                <MortgagesPage />
              </Suspense>
            ),
          },
          {
            path: "disbursements",
            loader: disbursementsLoader({ token, queryClient }),
            errorElement: <ErrorElement />,
            element: (
              <Suspense fallback={<LoaderElement heading="Disbursements" />}>
                <DisbursementsPage />
              </Suspense>
            ),
          },
          {
            path: "users",
            loader: usersLoader({ token, queryClient }),
            errorElement: <ErrorElement />,
            element: (
              <Suspense fallback={<LoaderElement heading="Users" />}>
                <UsersPage />
              </Suspense>
            ),
          },
        ],
      },
    ],
    {}
  );

  return (
    <>
      <RouterProvider router={routes} />
      <Toaster />
    </>
  );
}

export default App;
