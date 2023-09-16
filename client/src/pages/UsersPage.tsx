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
import { useGetAuth } from "@/services/session.service";
import { useGetUsers } from "@/services/user.service";

function UsersPage() {
  const { user } = useGetAuth();
  const { setMode } = useBoundStore((state) => state.user);

  const { data, isLoading } = useGetUsers({
    token: user?.accessToken ?? "",
  });

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
      <section
        id="dashboard-stores-page-stores"
        aria-labelledby="dashboard-stores-page-stores-heading"
      >
        <DataTable
          data={data ?? []}
          columns={userColumns}
          searchPlaceHolder="Filter categories..."
          isLoading={isLoading}
        />
      </section>
      <UserDialog />
    </Shell>
  );
}

export default UsersPage;
