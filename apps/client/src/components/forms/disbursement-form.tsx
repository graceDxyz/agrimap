import { Icons } from "@/components/icons";
import { AssistanceSelect } from "@/components/select/assistances-select";
import DateSelect from "@/components/select/date-select";
import { FarmerSelect } from "@/components/select/farmer-select";
import {
  AlertDialogCancel,
  AlertDialogFooter,
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
import { QUERY_DISBURSEMENTS_KEY } from "@/constant/query.constant";
import { useToast } from "@/hooks/useToast";
import { useBoundStore } from "@/lib/store";
import {
  createDisbursement,
  deleteDisbursement,
  updateDisbursement,
} from "@/services/disbursement.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn, useForm } from "react-hook-form";
import {
  CreateDisbursementInput,
  Disbursement,
  createDisbursementBody,
} from "schema";

interface MutationProps {
  disbursement: Disbursement;
}

export function CreateDisbursemntForm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { setDialogItem } = useBoundStore((state) => state.dialog);

  const form = useForm<CreateDisbursementInput>({
    resolver: zodResolver(createDisbursementBody),
    defaultValues: {
      farmer: "",
      assistances: [],
      size: 0,
      receivedDate: new Date().toString(),
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: createDisbursement,
    onSuccess: ({ data }) => {
      setDialogItem();
      toast({
        title: "Created",
        description: `Disbursement ${data._id} created successfully!`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries([QUERY_DISBURSEMENTS_KEY]);
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  function onSubmit(data: CreateDisbursementInput) {
    mutate(data);
  }

  return (
    <GenericForm
      form={form}
      isLoading={isLoading}
      onSubmit={onSubmit}
      buttonLabel="Add"
    />
  );
}

export function UpdateDisbursemntForm({ disbursement }: MutationProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { setDialogItem } = useBoundStore((state) => state.dialog);

  const form = useForm<CreateDisbursementInput>({
    resolver: zodResolver(createDisbursementBody),
    defaultValues: {
      ...disbursement,
      farmer: disbursement.farmer._id,
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: updateDisbursement,
    onSuccess: ({ data }) => {
      setDialogItem();
      toast({
        title: "Updated",
        description: `Disbursement ${data._id} updated successfully!`,
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries([QUERY_DISBURSEMENTS_KEY]);
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  function onSubmit(data: CreateDisbursementInput) {
    mutate({ id: disbursement?._id as string, data });
  }

  return (
    <GenericForm
      form={form}
      isLoading={isLoading}
      onSubmit={onSubmit}
      buttonLabel="Update"
    />
  );
}

export function DeleteDisbursementForm({ disbursement }: MutationProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { setDialogItem } = useBoundStore((state) => state.dialog);

  const { mutate, isLoading } = useMutation({
    mutationFn: deleteDisbursement,
    onSuccess: () => {
      queryClient.setQueriesData<Disbursement[]>(
        [QUERY_DISBURSEMENTS_KEY],
        (prev) => {
          if (prev) {
            return prev.filter((item) => item._id !== disbursement?._id);
          }
          return prev;
        },
      );

      setDialogItem();
      toast({
        title: "Deleted",
        description: `Disbursement ${disbursement?._id} deleted successfully!`,
      });
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  function handleDeleteClick() {
    mutate(disbursement?._id ?? "");
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

      <AlertDialogCancel type="button" disabled={isLoading}>
        Cancel
      </AlertDialogCancel>
    </AlertDialogFooter>
  );
}

function GenericForm({
  form,
  isLoading,
  onSubmit,
  buttonLabel,
}: {
  form: UseFormReturn<CreateDisbursementInput, unknown, undefined>;
  isLoading: boolean;
  onSubmit(data: CreateDisbursementInput): void;
  buttonLabel: "Add" | "Update";
}) {
  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="farmer"
          render={({ field: { value, onChange } }) => (
            <FormItem>
              <FormLabel>Farmer</FormLabel>
              <FormControl>
                <FarmerSelect
                  value={value}
                  onChange={(e) => onChange(e?.value)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="size"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Size (square meter)</FormLabel>
              <FormControl>
                <Input
                  className="disabled:opacity-100"
                  type="number"
                  placeholder="size"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="assistances"
          render={({ field: { value, onChange } }) => (
            <FormItem>
              <FormLabel>Assistances</FormLabel>
              <FormControl>
                <AssistanceSelect
                  value={value}
                  onChange={(e) => onChange(e.map((item) => item.value))}
                  onCreateOption={(e) => onChange([...value, e])}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="receivedDate"
          render={({ field: { value, onChange } }) => (
            <FormItem>
              <FormLabel>Received Date</FormLabel>
              <FormControl>
                <DateSelect value={value} onChange={(e) => onChange(e)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <AlertDialogFooter>
          <AlertDialogCancel type="button" disabled={isLoading}>
            Cancel
          </AlertDialogCancel>
          <Button disabled={isLoading}>
            {isLoading ? (
              <Icons.spinner
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            ) : buttonLabel === "Add" ? (
              <Icons.plus className="mr-2 h-4 w-4" aria-hidden="true" />
            ) : (
              <Icons.penLine className="mr-2 h-4 w-4" aria-hidden="true" />
            )}
            {buttonLabel}
            <span className="sr-only">{buttonLabel}</span>
          </Button>
        </AlertDialogFooter>
      </form>
    </Form>
  );
}
