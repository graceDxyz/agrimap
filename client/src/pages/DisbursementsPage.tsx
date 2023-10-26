import { disbursementColumns } from "@/components/data-table/columns";
import { DataTable } from "@/components/data-table/table";
import { DisbursementDialog } from "@/components/forms/disbursement-form";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Shell } from "@/components/shells/shell";
import { Button } from "@/components/ui/button";
import { useBoundStore } from "@/lib/store";
import { useGetDisbursements } from "@/services/disbursement.service";
import { disbursementLoader } from "@/services/loader";
import { useLoaderData } from "react-router-dom";

function DisbursementsPage() {
  const initialData = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof disbursementLoader>>
  >;

  const { data, isLoading } = useGetDisbursements({ initialData });
  const { setMode } = useBoundStore((state) => state.disbursement);

  function handleCreateClick() {
    setMode({ mode: "create" });
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

          <Button size="sm" onClick={handleCreateClick}>
            Add disbursement
          </Button>
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
      <DisbursementDialog />
    </Shell>
  );
}

export default DisbursementsPage;
