import { farmerColumns } from "@/components/data-table/columns";
import { DataTable } from "@/components/data-table/table";
import { FarmerDialog } from "@/components/forms/farmer-form";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Shell } from "@/components/shells/shell";
import { Button } from "@/components/ui/button";
import { useBoundStore } from "@/lib/store";
import { useGetFarmers } from "@/services/farmer.service";
import { useGetAuth } from "@/services/session.service";

function FarmersPage() {
  const { user } = useGetAuth();
  const { setMode } = useBoundStore((state) => state.farmer);

  const { data, isLoading } = useGetFarmers({
    token: user?.accessToken ?? "",
  });

  if (isLoading) {
    return <>Loading...</>;
  }
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
            Farmers
          </PageHeaderHeading>
          <Button size="sm" onClick={handleCreateClick}>
            Add farmer
          </Button>
        </div>
        <PageHeaderDescription size="sm">
          Manage the farmers
        </PageHeaderDescription>
      </PageHeader>
      <section
        id="dashboard-farmers"
        aria-labelledby="dashboard-farmers-heading"
      >
        <DataTable
          data={data ?? []}
          columns={farmerColumns}
          searchPlaceHolder="Filter farmers..."
          isLoading={isLoading}
        />
      </section>
      <FarmerDialog />
    </Shell>
  );
}

export default FarmersPage;
