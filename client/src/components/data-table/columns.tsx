import { ColumnDef } from "@tanstack/react-table";

import { DataTableColumnHeader } from "@/components/data-table/data-table-column-header";
import {
  FarmDataTableRowActions,
  FarmerDataTableRowActions,
  MortgageDataTableRowActions,
  UserDataTableRowActions,
} from "@/components/data-table/data-table-row-actions";
import { Badge } from "@/components/ui/badge";
import { Farm } from "@/types/farm.type";
import { Farmer } from "@/types/farmer.type";
import { Role, User } from "@/types/user.type";
import { Mortgage } from "@/types/mortgage.type";

export const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="w-[200px] capitalize font-medium">
        {row.getValue("fullName")}
      </div>
    ),
    enableHiding: false,
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
    cell: ({ row }) => {
      const role = row.getValue<Role>("role");
      return (
        <div className="w-[50px] font-medium">
          <Badge variant={role === "ADMIN" ? "default" : "outline"}>
            {role}
          </Badge>
        </div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <UserDataTableRowActions row={row} />,
  },
];

export const farmerColumns: ColumnDef<Farmer>[] = [
  {
    accessorKey: "fullName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="w-[200px] capitalize font-medium">
        {row.getValue("fullName")}
      </div>
    ),
    enableHiding: false,
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
    accessorKey: "totalSize",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Land Owned (Hectars)" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("totalSize") ?? 0}</div>
    ),
  },
  {
    accessorKey: "fullAddress",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Address" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("fullAddress")}</div>
    ),
  },

  {
    id: "actions",
    cell: ({ row }) => <FarmerDataTableRowActions row={row} />,
  },
];

export const farmColumns: ColumnDef<Farm>[] = [
  {
    accessorKey: "titleNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title Number" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("titleNumber")}</div>
    ),
  },
  {
    accessorKey: "owner",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Owner" />
    ),
    cell: ({ row }) => {
      const owner = row.getValue<Farmer>("owner");
      return (
        <div className="w-auto capitalize font-medium">{owner.firstname}</div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "size",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Size (Hectars)" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("size")}</div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <FarmDataTableRowActions row={row} />,
  },
];

export const mortgageColumns: ColumnDef<Mortgage>[] = [
  {
    accessorKey: "farm",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Land Owner" />
    ),
    cell: ({ row }) => {
      const farm = row.getValue<Farm>("farm");
      return (
        <div className="w-auto capitalize font-medium">
          {farm.owner.lastname + ", " + farm.owner.firstname}
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "mortgageTo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mortgage to" />
    ),
    cell: ({ row }) => {
      const mortgageTo = row.getValue<Farmer>("mortgageTo");
      return (
        <div className="w-auto capitalize font-medium">
          {mortgageTo.lastname + ", " + mortgageTo.firstname}
        </div>
      );
    },
    enableHiding: false,
  },
  {
    accessorKey: "farm.size",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Size (Hectars)" />
    ),
    cell: ({ row }) => {
      const farm = row.getValue<Farm>("farm");
      return <div className="w-auto capitalize font-medium">{farm.size}</div>;
    },
    enableHiding: false,
  },

  {
    id: "actions",
    cell: ({ row }) => <MortgageDataTableRowActions row={row} />,
  },
];
