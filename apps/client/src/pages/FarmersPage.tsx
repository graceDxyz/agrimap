import { farmerColumns } from "@/components/data-table/columns";
import { DataTable } from "@/components/data-table/table";
import { AddFarmerForm } from "@/components/forms/farmer-form";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Shell } from "@/components/shells/shell";
import { Button } from "@/components/ui/button";
import { useBoundStore } from "@/lib/store";
import { farmersLoader, useGetFarmers } from "@/services/farmer.service";
import { useLoaderData } from "react-router-dom";

function FarmersPage() {
  const initialData = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof farmersLoader>>
  >;

  const { data, isLoading } = useGetFarmers({ initialData });
  const { setDialogItem } = useBoundStore((state) => state.dialog);

  function handleCreateClick() {
    setDialogItem({
      title: "Add Farmer",
      description: "add a new farmer.",
      form: <AddFarmerForm />,
    });
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
    </Shell>
  );
}

export default FarmersPage;
