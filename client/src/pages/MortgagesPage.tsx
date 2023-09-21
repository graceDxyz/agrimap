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

  const { setMode } = useBoundStore((state) => state.mortgage);

  const { data, isLoading } = useGetMortgages({
    token: user?.accessToken ?? "",
  });

  if (isLoading) {
    return <>Loading...</>;
  }
  console.log(data);

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
            Mortgage land
          </PageHeaderHeading>
          <Button size="sm" onClick={handleCreateClick}>
            Add mortgage land
          </Button>
        </div>
        <PageHeaderDescription size="sm">
          Manage the mortgage land
        </PageHeaderDescription>
      </PageHeader>
      <section
        id="dashboard-stores-page-stores"
        aria-labelledby="dashboard-stores-page-stores-heading"
      >
        <MortgageDialog />
      </section>
    </Shell>
  );
}

export default MortgagesPage;
