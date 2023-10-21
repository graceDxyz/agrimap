import { disbursementColumns } from "@/components/data-table/columns";
import { DataTable } from "@/components/data-table/table";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Shell } from "@/components/shells/shell";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useGetDisbursements } from "@/services/disbursement.service";
import { useGetAuth } from "@/services/session.service";
import { Link } from "react-router-dom";

function DisbursementsPage() {
  const { user } = useGetAuth();

  const { data, isLoading } = useGetDisbursements({
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
            Disbursements
          </PageHeaderHeading>
          <Link
            aria-label="Add disbursement"
            to={"/dashboard/disbursements/add"}
            className={cn(
              buttonVariants({
                size: "sm",
              })
            )}
          >
            Add disbursement
          </Link>
        </div>
        <PageHeaderDescription size="sm">
          Manage the disbursements
        </PageHeaderDescription>
      </PageHeader>
      <section
        id="dashboard-disbursements"
        aria-labelledby="dashboard-disbursements-heading"
      >
        <DataTable
          data={data ?? []}
          columns={disbursementColumns}
          searchPlaceHolder="Filter disbursement..."
          isLoading={isLoading}
        />
      </section>
      {/* <DisbursementDialog /> */}
    </Shell>
  );
}

export default DisbursementsPage;
