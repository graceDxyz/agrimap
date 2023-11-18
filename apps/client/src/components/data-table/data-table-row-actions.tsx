import {
  DeleteDisbursementForm,
  UpdateDisbursemntForm,
} from "@/components/forms/disbursement-form";
import { ArchivedFarmForm } from "@/components/forms/farm-form";
import {
  DeleteFarmerForm,
  UpdateFarmerForm,
} from "@/components/forms/farmer-form";
import { DeleteMortgageForm } from "@/components/forms/mortgage-form";
import { DeleteUserForm, UpdateUserForm } from "@/components/forms/user-form";
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
import { QUERY_FARM_KEY, QUERY_MORTGAGE_KEY } from "@/constant/query.constant";
import { useBoundStore } from "@/lib/store";
import { useQueryClient } from "@tanstack/react-query";
import { Row } from "@tanstack/react-table";
import { useNavigate } from "react-router-dom";
import { Disbursement, Farm, Farmer, Mortgage, User } from "schema";

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
  const { setDialogItem } = useBoundStore((state) => state.dialog);
  const original = row.original as object as Farmer;

  function handleEditClick() {
    setDialogItem({
      title: "Update Farmer",
      description: "Update farmer information.",
      form: <UpdateFarmerForm farmer={original} />,
    });
  }

  function handleDeleteClick() {
    setDialogItem({
      title: "Are you absolutely sure?",
      description: "Delete farmer data (cannot be undone).",
      form: <DeleteFarmerForm farmer={original} />,
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

export function FarmDataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { setDialogItem } = useBoundStore((state) => state.dialog);
  const original = row.original as object as Farm;
  const stateLabel = original.isArchived ? "Unarchived" : "Archived";

  function handleViewClick() {
    queryClient.setQueryData([QUERY_FARM_KEY, original._id], original);
    navigate(`/dashboard/farms/${original._id}`);
  }

  function handleEditClick() {
    queryClient.setQueryData([QUERY_FARM_KEY, original._id], original);
    navigate(`/dashboard/farms/${original._id}/edit`);
  }

  function handleArchivedClick() {
    setDialogItem({
      title: "Are you absolutely sure?",
      description: `${stateLabel} farm data (reversible action).`,
      form: <ArchivedFarmForm farm={original} />,
    });
  }

  function handleMortgageClick() {
    navigate(`/dashboard/land-status/add`, {
      state: original,
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
        <DropdownMenuItem onClick={handleViewClick}>View</DropdownMenuItem>
        <DropdownMenuItem onClick={handleEditClick}>Edit</DropdownMenuItem>
        {!original.isArchived ? (
          <DropdownMenuItem onClick={handleMortgageClick}>
            Mortgage
          </DropdownMenuItem>
        ) : undefined}
        {!original.isMortgage ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleArchivedClick}>
              {stateLabel}
              <DropdownMenuShortcut></DropdownMenuShortcut>
            </DropdownMenuItem>
          </>
        ) : undefined}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function MortgageDataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const { user } = useBoundStore((state) => state.auth);
  const { setDialogItem } = useBoundStore((state) => state.dialog);
  const original = row.original as object as Mortgage;
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  function handleViewClick() {
    queryClient.setQueryData([QUERY_MORTGAGE_KEY, original._id], original);
    navigate(`/dashboard/land-status/${original._id}`);
  }

  function handleEditClick() {
    queryClient.setQueryData([QUERY_MORTGAGE_KEY, original._id], original);
    navigate(`/dashboard/land-status/${original._id}/edit`);
  }

  function handleDeleteClick() {
    setDialogItem({
      title: "Are you absolutely sure?",
      description: "Delete land status (cannot be undone).",
      form: <DeleteMortgageForm mortgage={original} />,
    });
  }

  if (user?.role === "ADMIN") {
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

  return (
    <Button onClick={handleViewClick} size={"sm"}>
      View
    </Button>
  );
}

export function DisbursementDataTableRowActions<TData>({
  row,
}: DataTableRowActionsProps<TData>) {
  const { setDialogItem } = useBoundStore((state) => state.dialog);
  const original = row.original as object as Disbursement;

  function handleEditClick() {
    setDialogItem({
      title: "Update Data",
      description: "update a disbursement data.",
      form: <UpdateDisbursemntForm disbursement={original} />,
    });
  }

  function handleDeleteClick() {
    setDialogItem({
      title: "Are you absolutely sure?",
      description: "Delete disbursement data (cannot be undone).",
      form: <DeleteDisbursementForm disbursement={original} />,
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
