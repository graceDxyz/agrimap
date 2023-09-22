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
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import {
  QUERY_FARMS_KEY,
  QUERY_MORTGAGES_KEY,
} from "@/constant/query.constant";
import { useBoundStore } from "@/lib/store";
import { createMortgageSchema } from "@/lib/validations/mortgage";
import {
  createMortgage,
  deleteMortgage,
  updateMortgage,
} from "@/services/mortgage.service";
import { useGetAuth } from "@/services/session.service";
import { DialogHeaderDetail, Mode } from "@/types";
import { CreateMortgageInput, Mortgage } from "@/types/mortgage.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export function MortgageDialog() {
  const { user } = useGetAuth();
  const { mode } = useBoundStore((state) => state.mortgage);
  const isOpen = mode !== "view";

  const modeToTitle: Record<Mode, DialogHeaderDetail> = {
    view: {
      title: "View Mortgage",
      description: "View mortgage details.",
    },
    create: {
      title: "Add Mortgage",
      description: "add a new mortgage.",
      form: <CreateForm token={user?.accessToken ?? ""} />,
    },
    update: {
      title: "Update Mortgage",
      description: "Update mortgage information.",
      form: <UpdateForm token={user?.accessToken ?? ""} />,
    },
    delete: {
      title: "Are you absolutely sure?",
      description: "Delete mortgage data (cannot be undone).",
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

function CreateForm({ token }: { token: string }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { setMode } = useBoundStore((state) => state.mortgage);

  const form = useForm<CreateMortgageInput>({
    resolver: zodResolver(createMortgageSchema),
    defaultValues: {
      status: "Active",
      farmId: "",
      mortgageToId: "",
      mortgageAmount: 0,
      startDate: "",
      endDate: "",
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: createMortgage,
    onSuccess: ({ data }) => {
      queryClient.setQueriesData<Mortgage[]>([QUERY_MORTGAGES_KEY], (items) => {
        if (items) {
          return [data, ...items];
        }
        return items;
      });

      handleCancelClick();
      toast({
        title: "Created",
        description: `Mortgage ${data._id} created successfully!`,
      });
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  function onSubmit(data: CreateMortgageInput) {
    mutate({ token, data });
  }

  function handleCancelClick() {
    setMode({ mode: "view" });
    form.reset();
  }

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="farmId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title number</FormLabel>
              <FormControl>
                <Input placeholder="title number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mortgageToId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mortgage To</FormLabel>
              <FormControl>
                <Input placeholder="mortgage to" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <AlertDialogFooter>
          <Button
            type="button"
            disabled={isLoading}
            variant={"outline"}
            onClick={handleCancelClick}
          >
            Cancel
          </Button>
          <Button disabled={isLoading}>
            {isLoading ? (
              <Icons.spinner
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Icons.plus className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            Add
            <span className="sr-only">Add</span>
          </Button>
        </AlertDialogFooter>
      </form>
    </Form>
  );
}

function UpdateForm({ token }: { token: string }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { setMode, mortgage } = useBoundStore((state) => state.mortgage);

  const form = useForm<CreateMortgageInput>({
    resolver: zodResolver(createMortgageSchema),
    defaultValues: {
      status: "Active",
      farmId: "",
      mortgageToId: "",
      mortgageAmount: 0,
      startDate: "",
      endDate: "",
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: updateMortgage,
    onSuccess: ({ data }) => {
      queryClient.setQueriesData<Mortgage[]>([QUERY_MORTGAGES_KEY], (items) => {
        if (items) {
          return items.map((item) => {
            if (item._id === data._id) {
              return data;
            }
            return item;
          });
        }
        return items;
      });
      handleCancelClick();
      toast({
        title: "Updated",
        description: `Mortgage ${data._id} updated successfully!`,
      });
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  function onSubmit(data: CreateMortgageInput) {
    mutate({ token, id: mortgage?._id as string, data });
  }

  function handleCancelClick() {
    setMode({ mode: "view" });
    form.reset();
  }

  useEffect(() => {
    if (mortgage) {
      form.reset({
        ...mortgage,
      });
    }
  }, [mortgage, form]);

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="farmId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Owner</FormLabel>
              <FormControl>
                <Input placeholder="firstname" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mortgageToId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mortgage To</FormLabel>
              <FormControl>
                <Input placeholder="lastname" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <AlertDialogFooter>
          <Button
            type="button"
            disabled={isLoading}
            variant={"outline"}
            onClick={handleCancelClick}
          >
            Cancel
          </Button>
          <Button disabled={isLoading}>
            {isLoading ? (
              <Icons.spinner
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            ) : (
              <Icons.penLine className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            Update
            <span className="sr-only">Add</span>
          </Button>
        </AlertDialogFooter>
      </form>
    </Form>
  );
}

function DeleteForm({ token }: { token: string }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { mortgage, setMode } = useBoundStore((state) => state.mortgage);

  const { mutate, isLoading } = useMutation({
    mutationFn: deleteMortgage,
    onSuccess: () => {
      queryClient.setQueriesData<Mortgage[]>([QUERY_MORTGAGES_KEY], (prev) => {
        if (prev) {
          return prev.filter((item) => item._id !== mortgage?._id);
        }
        return prev;
      });
      queryClient.invalidateQueries([QUERY_FARMS_KEY]);
      handleCancelClick();
      toast({
        title: "Deleted",
        description: `Mortgage ${mortgage?._id} deleted successfully!`,
      });
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  function handleDeleteClick() {
    mutate({ token, id: mortgage?._id ?? "" });
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
