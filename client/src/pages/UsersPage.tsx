import { userColumns } from "@/components/data-table/columns";
import { DataTable } from "@/components/data-table/table";
import { UserDialog } from "@/components/forms/user-form";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Shell } from "@/components/shells/shell";
import { Button } from "@/components/ui/button";
import { useBoundStore } from "@/lib/store";
import { userLoader } from "@/services/loader";
import { useGetUsers } from "@/services/user.service";
import { useLoaderData } from "react-router-dom";

function UsersPage() {
  const initialData = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof userLoader>>
  >;
  const { data, isLoading } = useGetUsers({ initialData });
  const { setMode } = useBoundStore((state) => state.user);

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
            Users
          </PageHeaderHeading>
          <Button size="sm" onClick={handleCreateClick}>
            Add User
          </Button>
        </div>
        <PageHeaderDescription size="sm">
          Manage the users
        </PageHeaderDescription>
      </PageHeader>
      <section id="dashboard-users" aria-labelledby="dashboard-users-heading">
        <DataTable
          data={data ?? []}
          columns={userColumns}
          searchPlaceHolder="Filter users..."
          isLoading={isLoading}
        />
      </section>
      <UserDialog />
    </Shell>
  );
}

export default UsersPage;
