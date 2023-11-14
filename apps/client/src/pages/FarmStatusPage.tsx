import { Icons } from "@/components/icons";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Shell } from "@/components/shells/shell";
import { Button } from "@/components/ui/button";
import { farmLoader } from "@/services/farm.service";
import { useLoaderData, useNavigate } from "react-router-dom";

function FarmStatusPage() {
  const navigate = useNavigate();
  const farmData = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof farmLoader>>
  >;
  const isLoading = false;

  console.log(farmData);
  return (
    <Shell variant="sidebar">
      <PageHeader
        id="dashboard-stores-page-header"
        aria-labelledby="dashboard-stores-page-header-heading"
      >
        <div className="flex space-x-4">
          <PageHeaderHeading size="sm" className="flex-1">
            Mortgage Farm
          </PageHeaderHeading>
          <Button onClick={() => navigate(-1)} variant={"outline"} size={"sm"}>
            Cancel
          </Button>
          <Button
            disabled={isLoading}
            // onClick={form.handleSubmit(onSubmit)}
            size={"sm"}
          >
            {isLoading ? (
              <Icons.spinner
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Icons.plus className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            Add
            <span className="sr-only">Add</span>
          </Button>
        </div>
        <PageHeaderDescription size="sm">Mortgage a farm</PageHeaderDescription>
      </PageHeader>
      <section
        id="dashboard-farms"
        aria-labelledby="dashboard-farms-heading"
        className="grid grid-cols-5 gap-4"
      ></section>
    </Shell>
  );
}

export default FarmStatusPage;
