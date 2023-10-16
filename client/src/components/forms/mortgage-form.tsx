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
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
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
import {
  createMortgageSchema,
  mortgageSchema,
} from "@/lib/validations/mortgage";
import { useGetFarms } from "@/services/farm.service";
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
import { useEffect, useState } from "react";
import { UseFormReturn, useForm } from "react-hook-form";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

import { cn } from "@/lib/utils";
import { useGetFarmers } from "@/services/farmer.service";
import { Farm } from "@/types/farm.type";
import { addMonths } from "date-fns";
import { CalendarDateRangePicker } from "../date-range-picker";

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
      mortgageDate: {
        from: new Date().toString(),
        to: addMonths(new Date(), 1).toString(),
      },
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: createMortgage,
    onSuccess: ({ data }) => {
      const newMortgage = mortgageSchema.parse(data);
      queryClient.setQueriesData<Mortgage[]>([QUERY_MORTGAGES_KEY], (items) => {
        if (items) {
          return [newMortgage, ...items];
        }
        return items;
      });

      queryClient.setQueriesData<Farm[]>([QUERY_FARMS_KEY], (items) => {
        if (items) {
          return items.map((item) => {
            if (item._id === data.farm?._id) {
              return { ...item, isMortgage: true };
            }
            return item;
          });
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
    <MortgageGenericForm
      form={form}
      handleCancelClick={handleCancelClick}
      isLoading={isLoading}
      onSubmit={onSubmit}
      buttonLabel="Add"
      token={token}
    />
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
      mortgageDate: {
        from: new Date().toString(),
        to: addMonths(new Date(), 1).toString(),
      },
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: updateMortgage,
    onSuccess: ({ data }) => {
      const upMortgage = mortgageSchema.parse(data);
      queryClient.setQueriesData<Mortgage[]>([QUERY_MORTGAGES_KEY], (items) => {
        if (items) {
          return items.map((item) => {
            if (item._id === upMortgage._id) {
              return upMortgage;
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
        farmId: mortgage.farm._id,
        mortgageToId: mortgage.mortgageTo._id,
      });
    }
  }, [mortgage, form]);

  return (
    <MortgageGenericForm
      form={form}
      handleCancelClick={handleCancelClick}
      isLoading={isLoading}
      onSubmit={onSubmit}
      buttonLabel="Update"
      token={token}
    />
  );
}

function DeleteForm({ token }: { token: string }) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { mortgage, setMode } = useBoundStore((state) => state.mortgage);

  const { mutate, isLoading } = useMutation({
    mutationFn: deleteMortgage,
    onSuccess: () => {
      queryClient.setQueriesData<Farm[]>([QUERY_FARMS_KEY], (items) => {
        if (items) {
          return items.map((item) => {
            if (item._id === mortgage?.farm._id) {
              return { ...item, isMortgage: false };
            }
            return item;
          });
        }
        return items;
      });
      queryClient.setQueriesData<Mortgage[]>([QUERY_MORTGAGES_KEY], (prev) => {
        if (prev) {
          return prev.filter((item) => item._id !== mortgage?._id);
        }
        return prev;
      });
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

function MortgageGenericForm({
  form,
  isLoading,
  onSubmit,
  handleCancelClick,
  buttonLabel,
  token,
}: {
  form: UseFormReturn<CreateMortgageInput, any, undefined>;
  isLoading: boolean;
  onSubmit(data: CreateMortgageInput): void;
  handleCancelClick(): void;
  buttonLabel: "Add" | "Update";
  token: string;
}) {
  const [isFarmOpen, setIsFarmOpen] = useState(false);
  const [isFarmerOpen, setIsFarmerOpen] = useState(false);

  const { data: farmData, isLoading: isFarmLoading } = useGetFarms({
    token,
  });

  const { data: farmersData, isLoading: isFarmersLoading } = useGetFarmers({
    token,
  });

  const selectedFarm = farmData?.find(
    (item) => item._id === form.getValues("farmId")
  );

  const selectedFarmers = farmersData?.find(
    (item) => item._id === form.getValues("mortgageToId")
  );

  const filteredFarm = farmData?.filter(
    (farm) =>
      !farm.isMortgage && farm.owner._id !== form.getValues("mortgageToId")
  );

  const filteredFarmer = farmersData?.filter((farmer) => {
    if (farmer._id === selectedFarm?.owner._id) {
      return false;
    }
    return true;
  });

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
              <Popover open={isFarmOpen} onOpenChange={setIsFarmOpen}>
                <PopoverTrigger asChild disabled={isFarmLoading}>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-label="Load a preset..."
                    aria-expanded={isFarmOpen}
                    className="flex-1 justify-between w-full"
                  >
                    {isFarmLoading ? (
                      "Loading ..."
                    ) : (
                      <>
                        {field.value ? (
                          <>{selectedFarm?.titleNumber}</>
                        ) : (
                          "Select title number..."
                        )}
                      </>
                    )}
                    <Icons.chevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search title numbers..." />
                    <CommandEmpty>No title number found.</CommandEmpty>
                    <CommandGroup heading="Title number">
                      {filteredFarm?.map((item) => (
                        <CommandItem
                          key={item._id}
                          onSelect={() => {
                            field.onChange(item._id);
                            setIsFarmOpen(false);
                          }}
                        >
                          {item.titleNumber}
                          <Icons.check
                            className={cn(
                              "ml-auto h-4 w-4",
                              field.value === item._id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mortgageToId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mortgage to</FormLabel>
              <Popover open={isFarmerOpen} onOpenChange={setIsFarmerOpen}>
                <PopoverTrigger asChild disabled={isFarmersLoading}>
                  <Button
                    variant="outline"
                    role="combobox"
                    aria-label="Load a preset..."
                    aria-expanded={isFarmerOpen}
                    className="flex-1 justify-between w-full"
                  >
                    {isFarmersLoading ? (
                      "Loading ..."
                    ) : (
                      <>
                        {field.value ? (
                          <>
                            {selectedFarmers?.lastname +
                              ", " +
                              selectedFarmers?.firstname}
                          </>
                        ) : (
                          "Select farmer..."
                        )}
                      </>
                    )}
                    <Icons.chevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="Search farmers..." />
                    <CommandEmpty>No farmers found.</CommandEmpty>
                    <CommandGroup heading="Farmers">
                      {filteredFarmer?.map((item) => (
                        <CommandItem
                          key={item._id}
                          onSelect={() => {
                            field.onChange(item._id);
                            setIsFarmerOpen(false);
                          }}
                          className="capitalize"
                        >
                          {item.lastname + ", " + item.firstname}
                          <Icons.check
                            className={cn(
                              "ml-auto h-4 w-4",
                              field.value === item._id
                                ? "opacity-100"
                                : "opacity-0"
                            )}
                          />
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="mortgageDate"
          render={({ field: { value, onChange } }) => (
            <FormItem>
              <FormLabel>Contract Duration</FormLabel>
              <CalendarDateRangePicker
                date={{
                  from: new Date(value.from),
                  to: new Date(value.to),
                }}
                onSelect={(e) => {
                  if (e?.from && e?.to) {
                    onChange({
                      from: e?.from?.toString() ?? value.from,
                      to: e?.to?.toString() ?? value.to,
                    });
                  }
                }}
              />
            </FormItem>
          )}
        />
        <FormItem>
          <FormLabel>Owner</FormLabel>
          <Input
            placeholder="owner"
            disabled
            className="disabled:opacity-100"
            value={selectedFarm?.owner.fullName ?? ""}
          />
        </FormItem>
        <FormItem>
          <FormLabel>Size (Hectars)</FormLabel>
          <Input
            placeholder="size"
            disabled
            className="disabled:opacity-100"
            value={selectedFarm?.size ?? ""}
          />
        </FormItem>
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
