import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { Icons } from "@/components/icons";
import {
  AlertDialogCancel,
  AlertDialogFooter,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  QUERY_FARMERS_KEY,
  QUERY_FARMS_KEY,
  QUERY_MORTGAGES_KEY,
  QUERY_STATISTICS_KEY,
} from "@/constant/query.constant";
import { useToast } from "@/hooks/useToast";
import { useBoundStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { useGetFarms } from "@/services/farm.service";
import { useGetFarmers } from "@/services/farmer.service";
import {
  createMortgage,
  deleteMortgage,
  updateMortgage,
} from "@/services/mortgage.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addMonths } from "date-fns";
import { useState } from "react";
import { UseFormReturn, useForm } from "react-hook-form";
import {
  CreateMortgageInput,
  Farm,
  Farmer,
  Mortgage,
  createMortgageBody,
  mortgageSchema,
} from "schema";

interface MutationProps {
  mortgage: Mortgage;
}

export function AddMortgageForm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { setDialogItem } = useBoundStore((state) => state.dialog);

  const form = useForm<CreateMortgageInput>({
    resolver: zodResolver(createMortgageBody),
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
      const farm = newMortgage.farm;
      const mortgageTo = newMortgage.mortgageTo;

      queryClient.setQueriesData<Mortgage[]>([QUERY_MORTGAGES_KEY], (items) => {
        if (items) {
          return [newMortgage, ...items];
        }
        return items;
      });

      queryClient.setQueriesData<Farm[]>([QUERY_FARMS_KEY], (items) => {
        if (items) {
          return items.map((item) => {
            if (item._id === farm._id) {
              return { ...item, isMortgage: true };
            }
            return item;
          });
        }
        return items;
      });

      queryClient.setQueriesData<Farmer[]>([QUERY_FARMERS_KEY], (items) => {
        if (items) {
          return items.map((item) => {
            if (item._id === mortgageTo._id) {
              const totalSize = item.totalSize ?? 0;
              return { ...item, totalSize: totalSize + farm.size };
            }

            if (item._id === farm.owner._id) {
              const totalSize = item.totalSize ?? 0;
              return { ...item, totalSize: totalSize - farm.size };
            }

            return item;
          });
        }
        return items;
      });

      queryClient.invalidateQueries([QUERY_FARMERS_KEY]);
      queryClient.refetchQueries([QUERY_STATISTICS_KEY, "count"]);
      setDialogItem();
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
    mutate(data);
  }

  return (
    <MortgageGenericForm
      form={form}
      isLoading={isLoading}
      onSubmit={onSubmit}
      buttonLabel="Add"
    />
  );
}

export function UpdateMortgageForm({ mortgage }: MutationProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { setDialogItem } = useBoundStore((state) => state.dialog);

  const form = useForm<CreateMortgageInput>({
    resolver: zodResolver(createMortgageBody),
    defaultValues: {
      ...mortgage,
      farmId: mortgage.farm._id,
      mortgageToId: mortgage.mortgageTo._id,
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
      queryClient.invalidateQueries([QUERY_FARMERS_KEY]);
      queryClient.refetchQueries([QUERY_STATISTICS_KEY, "count"]);
      setDialogItem();
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
    mutate({ id: mortgage?._id as string, data });
  }

  return (
    <MortgageGenericForm
      form={form}
      isLoading={isLoading}
      onSubmit={onSubmit}
      buttonLabel="Update"
    />
  );
}

export function DeleteMortgageForm({ mortgage }: MutationProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { setDialogItem } = useBoundStore((state) => state.dialog);

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

      queryClient.invalidateQueries([QUERY_FARMERS_KEY]);
      queryClient.refetchQueries([QUERY_STATISTICS_KEY, "count"]);
      setDialogItem();
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
    mutate(mortgage?._id ?? "");
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

function MortgageGenericForm({
  form,
  isLoading,
  onSubmit,
  buttonLabel,
}: {
  form: UseFormReturn<CreateMortgageInput, unknown, undefined>;
  isLoading: boolean;
  onSubmit(data: CreateMortgageInput): void;
  buttonLabel: "Add" | "Update";
}) {
  const [isFarmOpen, setIsFarmOpen] = useState(false);
  const [isFarmerOpen, setIsFarmerOpen] = useState(false);

  const { data: farmData, isLoading: isFarmLoading } = useGetFarms({});
  const { data: farmersData, isLoading: isFarmersLoading } = useGetFarmers({});

  const selectedFarm = farmData?.find(
    (item) => item._id === form.getValues("farmId")
  );

  const selectedFarmers = farmersData?.find(
    (item) => item._id === form.getValues("mortgageToId")
  );

  const filteredFarm = farmData
    ?.filter((farm) => !farm.isArchived)
    .filter(
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
          <FormLabel>Size (square meter)</FormLabel>
          <Input
            placeholder="size"
            disabled
            className="disabled:opacity-100"
            value={selectedFarm?.size ?? ""}
          />
        </FormItem>
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
