import { Icons } from "@/components/icons";
import { MemoizedOverview } from "@/components/overview";
import OverviewSwitcher from "@/components/overview-switcher";
import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { MemoizedRecentAddedFarmer } from "@/components/recent-added-farmer";
import { Shell } from "@/components/shells/shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useBoundStore } from "@/lib/store";
import { useGetExcelReport } from "@/services/report.service";
import { useGetAuth } from "@/services/session.service";
import {
  useGetRecentAdded,
  useGetStatistics,
} from "@/services/statistic.service";

function DashboardPage() {
  const { activeSwitcher } = useBoundStore((state) => state.overview);
  const { user } = useGetAuth();

  const { data: recentData, isLoading: isRecentLoading } = useGetRecentAdded({
    token: user?.accessToken ?? "",
  });

  const { data: statData, isLoading: isStatsLoading } = useGetStatistics({
    token: user?.accessToken ?? "",
    query: {
      by: activeSwitcher.value,
    },
    options: {
      refetchOnMount: "always",
    },
  });

  const { mutate, isLoading: isDownloadLoading } = useGetExcelReport({
    token: user?.accessToken ?? "",
  });

  return (
    <Shell variant="sidebar">
      <PageHeader
        id="dashboard-stores-page-header"
        aria-labelledby="dashboard-stores-page-header-heading"
      >
        <div className="flex items-center justify-between space-y-2">
          <PageHeaderHeading size="sm" className="flex-1">
            Dashboard
          </PageHeaderHeading>
          <div className="flex items-center space-x-2">
            <OverviewSwitcher />
            <Button
              onClick={() => mutate()}
              disabled={isDownloadLoading}
              variant={"outline"}
            >
              {isDownloadLoading ? (
                <Icons.spinner className="h-6 w-6 animate-spin" />
              ) : (
                <Icons.fileDownload className="h-6 w-6 text-primary" />
              )}
              Download
            </Button>
          </div>
        </div>
      </PageHeader>
      <section
        id="dashboard-stores-page-stores"
        aria-labelledby="dashboard-stores-page-stores-heading"
        className="space-y-4"
      >
        {/* <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Registered Farmers
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Farm Size (m²)
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2350</div>
              <p className="text-xs text-muted-foreground">
                +180.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Mortgage farm (m²)
              </CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <rect width="20" height="14" x="2" y="5" rx="2" />
                <path d="M2 10h20" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12,234</div>
              <p className="text-xs text-muted-foreground">
                +19% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Now</CardTitle>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                className="h-4 w-4 text-muted-foreground"
              >
                <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
              </svg>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground">
                +201 since last hour
              </p>
            </CardContent>
          </Card>
        </div> */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-5">
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>Overview</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <MemoizedOverview isLoading={isStatsLoading} data={statData} />
            </CardContent>
          </Card>
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Recent Added</CardTitle>
              <CardDescription>
                {recentData?.count ?? 0} farmer added this month.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isRecentLoading ? (
                <>Loading...</>
              ) : (
                <MemoizedRecentAddedFarmer farmers={recentData?.todayFarmers} />
              )}
            </CardContent>
          </Card>
        </div>
      </section>
    </Shell>
  );
}

// <MapContainer />
export default DashboardPage;
