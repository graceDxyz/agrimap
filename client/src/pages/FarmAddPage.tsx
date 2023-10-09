import {
  BarangaySelect,
  CitySelect,
  ProvinceSelect,
} from "@/components/address-select";
import { FarmDialog } from "@/components/forms/farm-form";
import { Icons } from "@/components/icons";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Shell } from "@/components/shells/shell";
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
import { useToast } from "@/components/ui/use-toast";
import { QUERY_FARMERS_KEY, QUERY_FARMS_KEY } from "@/constant/query.constant";
import { useMapDraw } from "@/hooks/useMapDraw";
import { UploadButton } from "@/lib/uploadthing";
import { cn } from "@/lib/utils";
import {
  coordinatesSchema,
  createFarmSchema,
  farmSchema,
} from "@/lib/validations/farm";
import { createFarm } from "@/services/farm.service";
import { useGetFarmers } from "@/services/farmer.service";
import { useGetAuth } from "@/services/session.service";
import { DrawEvent } from "@/types";
import { CreateFarmInput, Farm } from "@/types/farm.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

function FarmAddPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useGetAuth();
  const { toast } = useToast();

  const [open, setOpen] = useState(false);

  const { data, isLoading: isFarmerLoading } = useGetFarmers({
    token: user?.accessToken ?? "",
  });

  const form = useForm<CreateFarmInput>({
    resolver: zodResolver(createFarmSchema),
    defaultValues: {
      ownerId: "",
      size: 0,
      titleNumber: "",
      proofFiles: [],
      coordinates: [],
      address: {
        streetAddress: "",
        cityOrProvince: "",
        municipality: "",
        barangay: "",
        zipcode: "",
      },
    },
  });

  const mapRef = useMapDraw({
    mode: "edit",
    onUpdateArea: (e: DrawEvent) => {
      const coordinates = coordinatesSchema.parse(
        e.features[0].geometry.coordinates
      );
      form.reset((prev) => ({ ...prev, coordinates }));
    },
    onCalculateArea: (area: number) => {
      const size = parseFloat((area / 10000).toFixed(2));
      form.reset((prev) => ({ ...prev, size }));
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: createFarm,
    onSuccess: ({ data }) => {
      const newFarm = farmSchema.parse(data);
      toast({
        title: "Created",
        description: `Farm ${newFarm._id} created successfully!`,
      });
      queryClient.invalidateQueries([QUERY_FARMERS_KEY]);
      queryClient.setQueriesData<Farm[]>([QUERY_FARMS_KEY], (items) => {
        if (items) {
          return [newFarm, ...items];
        }
        return items;
      });
      navigate("/dashboard/farms");
    },
    onError: (error: AxiosError) => {
      const message = error.response?.data as string;
      if (message.includes("E11000")) {
        form.setError(
          "titleNumber",
          {
            message: "Title number already registered",
          },
          { shouldFocus: true }
        );
      }
    },
  });

  const selectedFarmer = data?.find(
    (item) => item._id === form.getValues("ownerId")
  );

  function onSubmit(data: CreateFarmInput) {
    mutate({ token: user?.accessToken ?? "", data });
  }

  return (
    <Shell variant="sidebar">
      <PageHeader
        id="dashboard-stores-page-header"
        aria-labelledby="dashboard-stores-page-header-heading"
      >
        <div className="flex space-x-4">
          <PageHeaderHeading size="sm" className="flex-1">
            Farms
          </PageHeaderHeading>
          <Link
            aria-label="cancel add"
            to={"/dashboard/farms"}
            className={cn(
              buttonVariants({
                size: "sm",
                variant: "outline",
              })
            )}
          >
            Cancel
          </Link>
          <Button
            disabled={isLoading}
            onClick={form.handleSubmit(onSubmit)}
            size={"sm"}
          >
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
        </div>
        <PageHeaderDescription size="sm">Add a new farm</PageHeaderDescription>
      </PageHeader>
      <section
        id="dashboard-farms"
        aria-labelledby="dashboard-farms-heading"
        className="grid grid-cols-5 gap-4"
      >
        <div className="h-[80vh] col-span-3 overflow-hidden" ref={mapRef} />
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
                      <PopoverTrigger asChild disabled={isFarmerLoading}>
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hectar</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="hectar" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="titleNumber"
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
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Street Address</FormLabel>
                    <FormControl>
                      <Input placeholder="street address" {...field} />
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
                    <FormLabel>Title File(s)</FormLabel>
                    <FormControl>
                      <div className="flex flex-col gap-5">
                        <div>
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
      </section>
      <FarmDialog />
    </Shell>
  );
}

export default FarmAddPage;
