import { landStatusColumns } from "@/components/data-table/columns";
import { DataTable } from "@/components/data-table/table";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Shell } from "@/components/shells/shell";
import { buttonVariants } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import { mortgagesLoader, useGetMortgages } from "@/services/mortgage.service";
import { Link, useLoaderData } from "react-router-dom";

function MortgagesPage() {
  const initialData = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof mortgagesLoader>>
  >;
  const { user } = useUser();
  const isAdmin = user?.role === "ADMIN";
  const { data, isLoading } = useGetMortgages({ initialData });

  const morgages = data?.filter((item) => !item.farm.isArchived) ?? [];

  return (
    <Shell variant="sidebar">
      <PageHeader
        id="dashboard-stores-page-header"
        aria-labelledby="dashboard-stores-page-header-heading"
      >
        <div className="flex space-x-4">
          <PageHeaderHeading size="sm" className="flex-1">
            Land status
          </PageHeaderHeading>
          {isAdmin ? (
            <Link
              aria-label="Add Data"
              to={"add"}
              className={cn(
                buttonVariants({
                  size: "sm",
                }),
              )}
            >
              Add farm
            </Link>
          ) : undefined}
        </div>
        <PageHeaderDescription size="sm">
          Manage the land status
        </PageHeaderDescription>
      </PageHeader>
      <section
        id="dashboard-stores-page-stores"
        aria-labelledby="dashboard-stores-page-stores-heading"
      >
        <DataTable
          data={morgages}
          columns={landStatusColumns}
          searchPlaceHolder="Filter status..."
          isLoading={isLoading}
        />
      </section>
    </Shell>
  );
}

export default MortgagesPage;
