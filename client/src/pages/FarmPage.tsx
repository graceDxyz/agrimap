import { farmColumns } from "@/components/data-table/columns";
import { DataTable } from "@/components/data-table/table";
import { FarmDialog } from "@/components/forms/farm-form";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Shell } from "@/components/shells/shell";
import { Button } from "@/components/ui/button";
import { useGetFarms } from "@/services/farm.service";
import { useGetAuth } from "@/services/session.service";
import { useBoundStore } from "@/lib/store";

function FarmsPage() {
  const { user } = useGetAuth();
  const { setMode } = useBoundStore((state) => state.farm);

  const { data, isLoading } = useGetFarms({
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
            Farms
          </PageHeaderHeading>
          <Button size="sm" onClick={handleCreateClick}>
            Add farm
          </Button>
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
        />
      </section>
      <FarmDialog />
    </Shell>
  );
}

export default FarmsPage;
