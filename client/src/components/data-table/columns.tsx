import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import { User } from "@/types/user.type";
import { UserDataTableRowActions } from "./data-table-row-actions";

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "firstname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Firstname" />
    ),
    cell: ({ row }) => (
      <div className="w-[100px] capitalize font-medium">
        {row.getValue("firstname")}
      </div>
    ),
  },
  {
    accessorKey: "lastname",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Lastname" />
    ),
    cell: ({ row }) => (
      <div className="w-[100px] capitalize font-medium">
        {row.getValue("lastname")}
      </div>
    ),
  },
  // {
  //   accessorKey: "lastname",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Lastname" />
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <div className="flex space-x-2">
  //         <span className="max-w-[500px] truncate capitalize">
  //           {row.getValue("lastname")}
  //         </span>
  //       </div>
  //     );
  //   },
  //   enableSorting: false,
  //   enableHiding: false,
  // },
  {
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="w-[100px] font-medium">{row.getValue("email")}</div>
    ),
  },
  {
    accessorKey: "password",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Password" />
    ),
    cell: ({ row }) => (
      <div className="w-[100px] font-medium">{row.getValue("password")}</div>
    ),
  },
  {
    accessorKey: "role",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Role" />
    ),
    cell: ({ row }) => (
      <div className="w-[100px] font-medium">{row.getValue("role")}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <UserDataTableRowActions row={row} />,
  },
];
