import { userColumns } from "@/components/data-table/columns";
import { DataTable } from "@/components/data-table/table";
import { AddUserForm } from "@/components/forms/user-form";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Shell } from "@/components/shells/shell";
import { Button } from "@/components/ui/button";
import { useBoundStore } from "@/lib/store";
import { useGetUsers, usersLoader } from "@/services/user.service";
import { useLoaderData } from "react-router-dom";

function UsersPage() {
  const initialData = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof usersLoader>>
  >;
  const { data, isLoading } = useGetUsers({ initialData });
  const { setDialogItem } = useBoundStore((state) => state.dialog);

  function handleCreateClick() {
    setDialogItem({
      title: "Add User",
      description: "Create a new user.",
      form: <AddUserForm />,
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
    </Shell>
  );
}

export default UsersPage;
