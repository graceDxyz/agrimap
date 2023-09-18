import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import {
  FarmerDataTableRowActions,
  UserDataTableRowActions,
} from "@/components/data-table/data-table-row-actions";
import { Badge } from "@/components/ui/badge";
import { Farm } from "@/types/farm.type";
import { Farmer } from "@/types/farmer.type";
import { User } from "@/types/user.type";

export const userColumns: ColumnDef<User>[] = [
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
    enableHiding: false,
  },
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
    accessorKey: "email",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Email" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("email")}</div>
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
      <div className="w-[100px] font-medium">
        <Badge>{row.getValue("role")} </Badge>
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <UserDataTableRowActions row={row} />,
  },
];

export const farmerColumns: ColumnDef<Farmer>[] = [
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
    enableHiding: false,
  },
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
    accessorKey: "phoneNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone Number" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("phoneNumber")}</div>
    ),
  },
  {
    accessorKey: "address",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("address")}</div>
    ),
  },
  {
    accessorKey: "totalHectars",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Hectars" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("totalHectars") ?? 0}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <FarmerDataTableRowActions row={row} />,
  },
];

export const farmColumns: ColumnDef<Farm>[] = [
  {
    accessorKey: "owner",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Owner" />
    ),
    cell: ({ row }) => {
      const owner = row.getValue<Farmer>("owner");
      return (
        <div className="w-auto capitalize font-medium">
          {owner.lastname + ", " + owner.firstname}
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "hectar",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Hectars" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("hectar")}</div>
    ),
  },

  {
    id: "actions",
    cell: ({ row }) => <FarmerDataTableRowActions row={row} />,
  },
];
