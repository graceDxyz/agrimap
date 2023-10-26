import { landStatusColumns } from "@/components/data-table/columns";
import { DataTable } from "@/components/data-table/table";
import { MortgageDialog } from "@/components/forms/mortgage-form";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Shell } from "@/components/shells/shell";
import { Button } from "@/components/ui/button";
import { useUser } from "@/hooks/useUser";
import { useBoundStore } from "@/lib/store";
import { mortgagesLoader } from "@/services/loader";
import { useGetMortgages } from "@/services/mortgage.service";
import { useLoaderData } from "react-router-dom";

function MortgagesPage() {
  const initialData = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof mortgagesLoader>>
  >;

  const { user } = useUser();
  const isAdmin = user?.user.role === "ADMIN";

  const { data, isLoading } = useGetMortgages({ initialData });
  const { setMode } = useBoundStore((state) => state.mortgage);

  function handleCreateClick() {
    setMode({ mode: "create" });
  }

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
            <Button size="sm" onClick={handleCreateClick}>
              Add data
            </Button>
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
        <MortgageDialog />
      </section>
    </Shell>
  );
}

export default MortgagesPage;
