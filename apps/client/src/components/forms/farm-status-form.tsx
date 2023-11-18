import { CalendarDateRangePicker } from "@/components/date-range-picker";
import { Icons } from "@/components/icons";
import {
  AlertDialogCancel,
  AlertDialogFooter,
} from "@/components/ui/alert-dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Form,
  FormControl,
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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  QUERY_FARMERS_KEY,
  QUERY_FARMS_KEY,
  QUERY_MORTGAGES_KEY,
  QUERY_STATISTICS_KEY,
} from "@/constant/query.constant";
import { useMapDrawMulti } from "@/hooks/useMapDrawMulti";
import { useToast } from "@/hooks/useToast";
import { useBoundStore } from "@/lib/store";
import { UploadButton } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { useGetFarms } from "@/services/farm.service";
import { useGetFarmers } from "@/services/farmer.service";
import { deleteMortgage } from "@/services/mortgage.service";
import { DrawEvent } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { CreateMortgageInput, Farm, Mortgage, coordinatesSchema } from "schema";

interface MutationProps {
  mortgage: Mortgage;
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

export function FarmStatusGenericForm({
  form,
  isEditMode,
  onSubmit,
}: {
  form: UseFormReturn<CreateMortgageInput, unknown, undefined>;
  isEditMode?: boolean;
  onSubmit(data: CreateMortgageInput): void;
}) {
  const [isFarmOpen, setIsFarmOpen] = useState(false);
  const [isFarmerOpen, setIsFarmerOpen] = useState(false);

  const { data: farmData, isLoading: isFarmLoading } = useGetFarms({});
  const { data: farmersData, isLoading: isFarmersLoading } = useGetFarmers({});

  const selectedFarm = farmData?.find(
    (item) => item._id === form.getValues("farmId"),
  );

  const selectedFarmers = farmersData?.find(
    (item) => item._id === form.getValues("mortgageToId"),
  );

  const filteredFarm = farmData
    ?.filter((farm) => !farm.isArchived)
    .filter((farm) => farm.owner._id !== form.getValues("mortgageToId"));

  const filteredFarmer = farmersData?.filter((farmer) => {
    if (farmer._id === selectedFarm?.owner._id) {
      return false;
    }
    return true;
  });

  const mapRef = useMapDrawMulti({
    mode: "edit",
    farm: selectedFarm,
    activeCoordinates: form.getValues("coordinates"),
    onUpdateArea: (e: DrawEvent) => {
      const coordinates = coordinatesSchema.parse(
        e.features[0].geometry.coordinates,
      );
      form.reset((prev) => ({ ...prev, coordinates }));
    },
    onCalculateArea: (area: number) => {
      const size = parseFloat(area.toFixed(2)); // parseFloat((area / 10000).toFixed(2));
      form.reset((prev) => ({ ...prev, size }));
    },
  });

  return (
    <>
      <div
        className="h-[calc(100vh-10rem)] col-span-3 overflow-hidden"
        ref={mapRef}
      />
      <ScrollArea className="h-[80vh] col-span-2 pr-2">
        <Form {...form}>
          <form
            className="grid gap-4  px-2"
            onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
          >
            <FormField
              control={form.control}
              name="coordinates"
              render={() => (
                <FormItem>
                  <FormMessage />
                </FormItem>
              )}
            />
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
                        className="flex-1 justify-between w-full disabled:opacity-100 disabled:cursor-not-allowed"
                        disabled={!isEditMode}
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
                        {isEditMode ? (
                          <Icons.chevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        ) : (
                          <></>
                        )}
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
                                    : "opacity-0",
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
              <FormLabel>Farm Size(square meter)</FormLabel>
              <Input
                placeholder="farm size"
                disabled
                className="disabled:opacity-100"
                value={selectedFarm?.size ?? ""}
              />
            </FormItem>
            <Separator />

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
                        className="flex-1 justify-between w-full disabled:opacity-100 disabled:cursor-not-allowed"
                        disabled={!isEditMode}
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
                        {isEditMode ? (
                          <Icons.chevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        ) : (
                          <></>
                        )}
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
                                    : "opacity-0",
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
              name="size"
              disabled={!isEditMode}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mortgage Size</FormLabel>
                  <FormControl>
                    <Input
                      className="disabled:opacity-100"
                      type="number"
                      placeholder="mortgage size"
                      disabled={!isEditMode}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mortgageDate"
              disabled={isEditMode}
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
                    disabled={!isEditMode}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="proofFiles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document(s)</FormLabel>
                  <FormControl>
                    <div className="flex flex-col gap-5">
                      <div className={cn(isEditMode ? "visible" : "hidden")}>
                        <UploadButton
                          endpoint="proofFiles"
                          className="ut-label:text-lg ut-allowed-content:ut-uploading:text-red-300 ut-button:bg-primary ut-button:text-primary-foreground ut-button:hover:bg-primary/90 ut-button:w-full"
                          onClientUploadComplete={(res) => {
                            if (res) {
                              field.onChange([...field.value, ...res]);
                            }
                          }}
                          onUploadError={(error: Error) => {
                            console.log(error);
                            form.setError("proofFiles", {
                              message: "Please select a valid file!",
                            });
                          }}
                        />
                      </div>
                      <FormMessage />
                      <Separator />
                      <div className="flex flex-col gap-2">
                        {field.value.map((item) => (
                          <div
                            key={item.fileKey}
                            className="flex gap-2 items-center hover:bg-slate-50 rounded-lg"
                          >
                            <a
                              href={item.fileUrl}
                              target="_blank"
                              className={cn(
                                buttonVariants({
                                  size: "sm",
                                  variant: "link",
                                }),
                                "w-full justify-start",
                              )}
                            >
                              {item.fileName}
                            </a>
                            <Button
                              className={cn(isEditMode ? "visible" : "hidden")}
                              type="button"
                              size={"icon"}
                              variant={"ghost"}
                              onClick={() => {
                                field.onChange(
                                  field.value.filter(
                                    (file) => file.fileKey !== item.fileKey,
                                  ),
                                );
                              }}
                            >
                              <Icons.trash
                                className="h-4 w-4"
                                aria-hidden="true"
                              />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </ScrollArea>
    </>
  );
}
