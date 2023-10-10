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
import { Mortgage } from "@/types/mortgage.type";
import { Role, User } from "@/types/user.type";

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
      <div className="font-medium text-center">
        {row.getValue("phoneNumber")}
      </div>
    ),
  },
  {
    accessorKey: "totalSize",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Owned Area(m²)" />
    ),
    cell: ({ row }) => (
      <div className="font-medium text-center">
        {row.getValue("totalSize") ?? 0}
      </div>
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
    accessorKey: "ownerName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Owner" />
    ),
    cell: ({ row }) => (
      <div className="w-auto capitalize font-medium">
        {row.getValue("ownerName")}
      </div>
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    enableHiding: false,
  },
  {
    accessorKey: "size",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Size (m²)" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("size")}</div>
    ),
  },
  {
    accessorKey: "isMortgage",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mortgage Status" />
    ),
    cell: ({ row }) => (
      <div className="font-medium">
        {!row.getValue("isMortgage") ? "Not" : ""} Mortgage
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <FarmDataTableRowActions row={row} />,
  },
];

export const mortgageColumns: ColumnDef<Mortgage>[] = [
  {
    accessorKey: "farmTitle",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title number" />
    ),
    cell: ({ row }) => (
      <div className="w-auto capitalize font-medium">
        {row.getValue("farmTitle")}
      </div>
    ),
  },
  {
    accessorKey: "mortgageToName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Mortgage to" />
    ),
    cell: ({ row }) => (
      <div className="w-auto capitalize font-medium">
        {row.getValue("mortgageToName")}
      </div>
    ),
  },
  {
    accessorKey: "farmerName",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Land Owner" />
    ),
    cell: ({ row }) => (
      <div className="w-auto capitalize font-medium">
        {row.getValue("farmerName")}
      </div>
    ),
  },

  {
    accessorKey: "farmSize",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Size (m²)" />
    ),
    cell: ({ row }) => (
      <div className="w-auto capitalize font-medium">
        {row.getValue("farmSize")}
      </div>
    ),
  },

  {
    id: "actions",
    cell: ({ row }) => <MortgageDataTableRowActions row={row} />,
  },
];
