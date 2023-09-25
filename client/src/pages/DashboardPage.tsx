import { MemoizedOverview } from "@/components/overview";
import OverviewSwitcher from "@/components/overview-switcher";
import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { MemoizedRecentAddedFarmer } from "@/components/recent-added-farmer";
import { Shell } from "@/components/shells/shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useBoundStore } from "@/lib/store";
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

  return (
    <Shell variant="sidebar">
      <PageHeader
        id="dashboard-stores-page-header"
        aria-labelledby="dashboard-stores-page-header-heading"
      >
        <div className="flex space-x-4">
          <PageHeaderHeading size="sm" className="flex-1">
            Dashboard
          </PageHeaderHeading>
        </div>
      </PageHeader>
      <section
        id="dashboard-stores-page-stores"
        aria-labelledby="dashboard-stores-page-stores-heading"
        className="space-y-4"
      >
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-5">
            <CardHeader>
              <CardTitle className="flex justify-between">
                <span>Overview</span> <OverviewSwitcher />
              </CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              {isStatsLoading ? (
                <>Loading...</>
              ) : (
                <MemoizedOverview data={statData ?? []} />
              )}
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
