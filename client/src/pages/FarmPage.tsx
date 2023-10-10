import { farmColumns } from "@/components/data-table/columns";
import { DataTable } from "@/components/data-table/table";
import { FarmDialog } from "@/components/forms/farm-form";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Shell } from "@/components/shells/shell";
import { buttonVariants } from "@/components/ui/button";
import { useGetFarms } from "@/services/farm.service";
import { useGetAuth } from "@/services/session.service";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

function FarmsPage() {
  const { user } = useGetAuth();

  const { data, isLoading } = useGetFarms({
    token: user?.accessToken ?? "",
  });

  if (isLoading) {
    return <>Loading...</>;
  }

  return (
    <Shell variant="sidebar">
      <PageHeader
        id="dashboard-stores-page-header"
        aria-labelledby="dashboard-stores-page-header-heading"
      >
        <div className="flex space-x-4">
          <PageHeaderHeading size="sm" className="flex-1">
            Farms
          </PageHeaderHeading>
          <Link
            aria-label="Add farm"
            to={"/dashboard/farms/add"}
            className={cn(
              buttonVariants({
                size: "sm",
              }),
            )}
          >
            Add farm
          </Link>
        </div>
        <PageHeaderDescription size="sm">
          Manage the farms
        </PageHeaderDescription>
      </PageHeader>
      <section id="dashboard-farms" aria-labelledby="dashboard-farms-heading">
        <DataTable
          data={data ?? []}
          columns={farmColumns}
          searchPlaceHolder="Filter farms..."
          isLoading={isLoading}
          facetFilter
        />
      </section>
      <FarmDialog />
    </Shell>
  );
}

export default FarmsPage;
