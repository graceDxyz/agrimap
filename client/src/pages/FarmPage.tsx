import { farmColumns } from "@/components/data-table/columns";
import { DataTable } from "@/components/data-table/table";
import { useFarmVisibleFilter } from "@/components/farm-visible-select";
import { FarmDialog } from "@/components/forms/farm-form";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Shell } from "@/components/shells/shell";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGetFarms } from "@/services/farm.service";
import { useGetAuth } from "@/services/session.service";
import { Link } from "react-router-dom";

function FarmsPage() {
  const { user } = useGetAuth();
  const { value } = useFarmVisibleFilter();

  const { data, isLoading } = useGetFarms({
    token: user?.accessToken ?? "",
  });

  if (isLoading) {
    return <>Loading...</>;
  }

  const filter = value.value;
  const farms =
    data?.filter((farm) =>
      filter != undefined ? filter === farm.isArchived : true,
    ) ?? [];

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
          data={farms}
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
