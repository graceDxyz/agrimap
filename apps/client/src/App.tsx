import { useQueryClient } from "@tanstack/react-query";
import React, { lazy, Suspense } from "react";
import {
  createBrowserRouter,
  Navigate,
  RouterProvider,
} from "react-router-dom";

import { disbursementsLoader } from "@/services/disbursement.service";
import { farmLoader, farmsLoader } from "@/services/farm.service";
import { farmersLoader } from "@/services/farmer.service";
import { mortgagesLoader } from "@/services/mortgage.service";
import { mapLoader } from "@/services/statistic.service";
import { useGetSession } from "@/services/session.service";
import { usersLoader } from "@/services/user.service";

import ErrorElement from "@/components/elements/ErrorElement";
import LoaderElement from "@/components/elements/LoaderElement";
import { DashboardShell } from "@/components/shells/layout-shell";
import { Toaster } from "@/components/ui/toaster";
import { DialogViewPort } from "@/components/dialog-view-port";

const DashboardPage = lazy(() => import("@/pages/DashboardPage"));
const FarmAddPage = lazy(() => import("@/pages/FarmAddPage"));
const FarmAreaPage = lazy(() => import("@/pages/FarmAreaPage"));
const FarmStatusPage = lazy(() => import("@/pages/FarmStatusPage"));
const FarmStatusAddPage = lazy(() => import("@/pages/FarmStatusAddPage"));
const FarmersPage = lazy(() => import("@/pages/FarmersPage"));
const FarmsPage = lazy(() => import("@/pages/FarmsPage"));
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
            loader: mapLoader({ queryClient }),
            errorElement: <ErrorElement />,
            element: (
              <Suspense fallback={<LoaderElement heading="Map" />}>
                <MapPage />
              </Suspense>
            ),
          },
          {
            path: "farmers",
            loader: farmersLoader({ queryClient }),
            errorElement: <ErrorElement />,
            element: (
              <Suspense fallback={<LoaderElement heading="Farmers" />}>
                <FarmersPage />
              </Suspense>
            ),
          },
          {
            path: "farms",
            children: [
              {
                index: true,
                loader: farmsLoader({ queryClient }),
                errorElement: <ErrorElement />,
                element: (
                  <Suspense fallback={<LoaderElement heading="Farms" />}>
                    <FarmsPage />
                  </Suspense>
                ),
              },
              {
                path: "add",
                element: (
                  <Suspense fallback={<LoaderElement heading="Farms" />}>
                    <FarmAddPage />
                  </Suspense>
                ),
              },
              {
                path: ":farmId",
                loader: farmLoader({ queryClient }),
                errorElement: <ErrorElement />,
                element: (
                  <Suspense fallback={<LoaderElement heading="Farms" />}>
                    <FarmAreaPage />
                  </Suspense>
                ),
              },
              {
                path: ":farmId/edit",
                loader: farmLoader({ queryClient }),
                errorElement: <ErrorElement />,
                element: (
                  <Suspense fallback={<LoaderElement heading="Farms" />}>
                    <FarmAreaPage />
                  </Suspense>
                ),
              },
            ],
          },
          {
            path: "land-status",
            children: [
              {
                index: true,
                loader: mortgagesLoader({ queryClient }),
                errorElement: <ErrorElement />,
                element: (
                  <Suspense fallback={<LoaderElement heading="Land status" />}>
                    <MortgagesPage />
                  </Suspense>
                ),
              },
              {
                path: "add",
                element: (
                  <Suspense fallback={<LoaderElement heading="Add Mortgage" />}>
                    <FarmStatusAddPage />
                  </Suspense>
                ),
              },
            ],
          },
          {
            path: "disbursements",
            loader: disbursementsLoader({ queryClient }),
            errorElement: <ErrorElement />,
            element: (
              <Suspense fallback={<LoaderElement heading="Disbursements" />}>
                <DisbursementsPage />
              </Suspense>
            ),
          },
          {
            path: "users",
            loader: usersLoader({ queryClient }),
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
    {},
  );

  return (
    <React.Fragment>
      <RouterProvider router={routes} />
      <Toaster />
      <DialogViewPort />
    </React.Fragment>
  );
}

export default App;
