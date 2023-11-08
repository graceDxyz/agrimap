import { Row } from "@tanstack/react-table";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { QUERY_FARM_KEY } from "@/constant/query.constant";
import { useBoundStore } from "@/lib/store";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { Disbursement, Farm, Farmer, Mortgage, User } from "schema";
import { DeleteUserForm, UpdateUserForm } from "../forms/user-form";

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
}

export function UserDataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const { setDialogItem } = useBoundStore((state) => state.dialog);
  const original = row.original as object as User;

  function handleEditClick() {
    setDialogItem({
      title: "Update User",
      description: "Update user information.",
      form: <UpdateUserForm user={original} />,
    });
  }

  function handleDeleteClick() {
    setDialogItem({
      title: "Are you absolutely sure?",
      description: "Delete user data (cannot be undone).",
      form: <DeleteUserForm user={original} />,
    });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <Icons.horizontalThreeDots className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={handleEditClick}>Edit</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDeleteClick}>
          Delete
          <DropdownMenuShortcut></DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function FarmerDataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const { setMode } = useBoundStore((state) => state.farmer);
  const original = row.original as object as Farmer;

  function handleEditClick() {
    setMode({ mode: "update", farmer: original });
  }

  function handleDeleteClick() {
    setMode({ mode: "delete", farmer: original });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <Icons.horizontalThreeDots className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={handleEditClick}>Edit</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDeleteClick}>
          Delete
          <DropdownMenuShortcut></DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function FarmDataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setMode } = useBoundStore((state) => state.farm);
  const original = row.original as object as Farm;

  function handleViewClick() {
    queryClient.setQueryData([QUERY_FARM_KEY, original._id], original);
    navigate(`/dashboard/farms/${original._id}`);
  }

  function handleEditClick() {
    queryClient.setQueryData([QUERY_FARM_KEY, original._id], original);
    navigate(`/dashboard/farms/${original._id}/edit`);
  }

  function handleDeleteClick() {
    setMode({ mode: "delete", farm: original });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <Icons.horizontalThreeDots className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={handleViewClick}>View</DropdownMenuItem>
        <DropdownMenuItem onClick={handleEditClick}>Edit</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDeleteClick}>
          {original.isArchived ? "Unarchived" : "Archived"}
          <DropdownMenuShortcut></DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function MortgageDataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const { user } = useBoundStore((state) => state.auth);
  const { setMode } = useBoundStore((state) => state.mortgage);
  const original = row.original as object as Mortgage;
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  function handleViewClick() {
    queryClient.setQueryData(
      [QUERY_FARM_KEY, original.farm._id],
      original.farm,
    );
    navigate(`/dashboard/farms/${original.farm._id}`);
  }

  function handleEditClick() {
    setMode({ mode: "update", mortgage: original });
  }

  function handleDeleteClick() {
    setMode({ mode: "delete", mortgage: original });
  }

  if (user?.role === "USER") {
    return (
      <Button onClick={handleViewClick} size={"sm"}>
        View
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <Icons.horizontalThreeDots className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={handleViewClick}>View</DropdownMenuItem>
        <DropdownMenuItem onClick={handleEditClick}>Edit</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDeleteClick}>
          Delete
          <DropdownMenuShortcut></DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function DisbursementDataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const { setMode } = useBoundStore((state) => state.disbursement);
  const original = row.original as object as Disbursement;

  function handleEditClick() {
    setMode({ mode: "update", disbursement: original });
  }

  function handleDeleteClick() {
    setMode({ mode: "delete", disbursement: original });
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <Icons.horizontalThreeDots className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem onClick={handleEditClick}>Edit</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleDeleteClick}>
          Delete
          <DropdownMenuShortcut></DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
