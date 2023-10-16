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
import { Button, buttonVariants } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { QUERY_FARMS_KEY } from "@/constant/query.constant";
import { useBoundStore } from "@/lib/store";
import { UploadButton } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import { deleteFarm } from "@/services/farm.service";
import { useGetFarmers } from "@/services/farmer.service";
import { useGetAuth } from "@/services/session.service";
import { DialogHeaderDetail, Mode } from "@/types";
import { CreateFarmInput, Farm } from "@/types/farm.type";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { UseFormReturn } from "react-hook-form";
import { BarangaySelect, CitySelect, ProvinceSelect } from "../address-select";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "../ui/command";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

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

export function FarmGenericForm({
  form,
  token,
  isEditMode,
}: {
  form: UseFormReturn<CreateFarmInput, any, undefined>;
  token: string;
  isEditMode: boolean;
}) {
  const [open, setOpen] = useState(false);

  const { data, isLoading: isFarmerLoading } = useGetFarmers({ token });

  const selectedFarmer = data?.find(
    (item) => item._id === form.getValues("ownerId")
  );

  return (
    <ScrollArea className="h-[80vh] col-span-2 pr-2">
      <ScrollArea className="h-[80vh] col-span-2 pr-2">
        <Form {...form}>
          <form className="grid gap-4 px-2">
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
              name="ownerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Owner</FormLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger
                      asChild
                      disabled={isFarmerLoading || !isEditMode}
                    >
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-label="Load a preset..."
                        aria-expanded={open}
                        className="flex-1 justify-between w-full"
                      >
                        {isFarmerLoading ? (
                          "Loading ..."
                        ) : (
                          <>
                            {field.value ? (
                              <>
                                {selectedFarmer?.lastname +
                                  ", " +
                                  selectedFarmer?.firstname}
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
                          {data?.map((item) => (
                            <CommandItem
                              key={item._id}
                              onSelect={() => {
                                field.onChange(item._id);
                                setOpen(false);
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
              name="size"
              disabled={!isEditMode}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Size (m²)</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="size" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="titleNumber"
              disabled={!isEditMode}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title Number</FormLabel>
                  <FormControl>
                    <Input placeholder="title number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address.streetAddress"
              disabled={!isEditMode}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purok/Sitio</FormLabel>
                  <FormControl>
                    <Input placeholder="purok/sitio" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="address.cityOrProvince"
                  render={({ field: { value, onChange } }) => (
                    <FormItem>
                      <FormLabel>Province</FormLabel>
                      <ProvinceSelect
                        isDisabled={!isEditMode}
                        value={value != "" ? { label: value } : undefined}
                        onChange={(e) => onChange(e?.label)}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="address.municipality"
                  render={({ field: { value, onChange } }) => (
                    <FormItem>
                      <FormLabel>City/Municipality</FormLabel>
                      <CitySelect
                        isDisabled={!isEditMode}
                        value={value != "" ? { label: value } : undefined}
                        onChange={(e) => onChange(e?.label)}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="address.barangay"
                  render={({ field: { value, onChange } }) => (
                    <FormItem>
                      <FormLabel>Barangay</FormLabel>
                      <BarangaySelect
                        isDisabled={!isEditMode}
                        value={value != "" ? { label: value } : undefined}
                        onChange={(e) => onChange(e?.label)}
                      />
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  disabled={!isEditMode}
                  name="address.zipcode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Zipcode</FormLabel>
                      <FormControl>
                        <Input placeholder="zipcode" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
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
                                "w-full justify-start"
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
                                    (file) => file.fileKey !== item.fileKey
                                  )
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
    </ScrollArea>
  );
}
