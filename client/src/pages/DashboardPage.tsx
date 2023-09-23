import { MemoizedOverview } from "@/components/overview";
import OverviewSwitcher from "@/components/overview-switcher";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { MemoizedRecentAddedFarmer } from "@/components/recent-added-farmer";
import { Shell } from "@/components/shells/shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetAuth } from "@/services/session.service";
import { useGetRecentAdded } from "@/services/statistic.service";

function DashboardPage() {
  const { user } = useGetAuth();

  const { data, isLoading } = useGetRecentAdded({
    token: user?.accessToken ?? "",
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
        <PageHeaderDescription size="sm">Dashboard page</PageHeaderDescription>
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
              <MemoizedOverview data={[]} />
            </CardContent>
          </Card>
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Recent Added</CardTitle>
              <CardDescription>
                {data?.count ?? 0} farmer added this month.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <MemoizedRecentAddedFarmer farmers={data?.todayFarmers} />
            </CardContent>
          </Card>
        </div>
      </section>
    </Shell>
  );
}

// <MapContainer />
export default DashboardPage;
