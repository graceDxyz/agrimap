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
import { useBoundStore } from "@/lib/store";
import { useGetMortgages } from "@/services/mortgage.service";
import { useGetAuth } from "@/services/session.service";

function MortgagesPage() {
  const { user } = useGetAuth();
  const isAdmin = user?.user.role === "ADMIN";
  const { setMode } = useBoundStore((state) => state.mortgage);

  const { data, isLoading } = useGetMortgages({
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
          data={data ?? []}
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
