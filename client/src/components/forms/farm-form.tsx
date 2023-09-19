import { Icons } from "@/components/icons";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { QUERY_FARMS_KEY } from "@/constant/query.constant";
import { useBoundStore } from "@/lib/store";
import { deleteFarm } from "@/services/farm.service";
import { useGetAuth } from "@/services/session.service";
import { DialogHeaderDetail, Mode } from "@/types";
import { Farm } from "@/types/farm.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function FarmDialog() {
  const { user } = useGetAuth();
  const { mode } = useBoundStore((state) => state.farm);
  const isOpen = mode !== "view";

  const modeToTitle: Record<Mode, DialogHeaderDetail> = {
    view: {
      title: "View Farm",
      description: "View farm details.",
    },
    create: {
      title: "Add Farm",
      description: "add a new farm.",
    },
    update: {
      title: "Update Farm",
      description: "Update farm information.",
    },
    delete: {
      title: "Are you absolutely sure?",
      description: "Delete farm data (cannot be undone).",
      form: <DeleteForm token={user?.accessToken ?? ""} />,
    },
  };

  const { title, description, form } = modeToTitle[mode];

  return (
    <AlertDialog open={isOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description} </AlertDialogDescription>
        </AlertDialogHeader>
        <Separator />
        <div>{form}</div>
      </AlertDialogContent>
    </AlertDialog>
  );
}

function DeleteForm({ token }: { token: string }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { farm, setMode } = useBoundStore((state) => state.farm);

  const { mutate, isLoading } = useMutation({
    mutationFn: deleteFarm,
    onSuccess: () => {
      queryClient.setQueriesData<Farm[]>([QUERY_FARMS_KEY], (prev) => {
        const farms = prev as Farm[];
        return farms.filter((item) => item._id !== farm?._id);
      });

      handleCancelClick();
      toast({
        title: "Deleted",
        description: `Farm ${farm?._id} deleted successfully!`,
      });
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  function handleDeleteClick() {
    mutate({ token, id: farm?._id ?? "" });
  }

  function handleCancelClick() {
    setMode({ mode: "view" });
  }
  return (
    <AlertDialogFooter>
      <Button
        variant={"destructive"}
        disabled={isLoading}
        onClick={handleDeleteClick}
      >
        {isLoading && (
          <Icons.spinner
            className="mr-2 h-4 w-4 animate-spin"
            aria-hidden="true"
          />
        )}
        Continue
      </Button>

      <AlertDialogCancel disabled={isLoading} onClick={handleCancelClick}>
        Cancel
      </AlertDialogCancel>
    </AlertDialogFooter>
  );
}
