import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Shell } from "@/components/shells/shell";
import { Button } from "@/components/ui/button";
import { useGetFarmers } from "@/services/farmer.service";
import { useGetAuth } from "@/services/session.service";

function FarmersPage() {
  const { user } = useGetAuth();

  const { data, isLoading } = useGetFarmers({
    token: user?.accessToken ?? "",
  });

  if (isLoading) {
    return <>Loading...</>;
  }

  console.log(data);

  return (
    <Shell variant="sidebar">
      <PageHeader
        id="dashboard-stores-page-header"
        aria-labelledby="dashboard-stores-page-header-heading"
      >
        <div className="flex space-x-4">
          <PageHeaderHeading size="sm" className="flex-1">
            Farmers
          </PageHeaderHeading>
          <Button size="sm">Add farmer</Button>
        </div>
        <PageHeaderDescription size="sm">
          Manage the farmers
        </PageHeaderDescription>
      </PageHeader>
      <section
        id="dashboard-stores-page-stores"
        aria-labelledby="dashboard-stores-page-stores-heading"
      ></section>
    </Shell>
  );
}

export default FarmersPage;
