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
import { farmsLoader } from "@/services/loader";
import { Link, useLoaderData } from "react-router-dom";

function FarmsPage() {
  const initialData = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof farmsLoader>>
  >;
  const { data, isLoading } = useGetFarms({ initialData });

  const { value } = useFarmVisibleFilter();
  const filter = value.value;
  const farms =
    data?.filter((farm) =>
      filter != undefined ? filter === farm.isArchived : true
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
              })
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
