import { FarmDialog } from "@/components/forms/farm-form";
import { Icons } from "@/components/icons";
import { useMapDraw } from "@/components/map";
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
import { useToast } from "@/components/ui/use-toast";
import { QUERY_FARMERS_KEY, QUERY_FARMS_KEY } from "@/constant/query.constant";
import { cn } from "@/lib/utils";
import { coordinatesSchema, createFarmSchema } from "@/lib/validations/farm";
import { createFarm } from "@/services/farm.service";
import { useGetFarmers } from "@/services/farmer.service";
import { useGetAuth } from "@/services/session.service";
import { DrawEvent } from "@/types";
import { CreateFarmInput, Farm } from "@/types/farm.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";

function FarmAddPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useGetAuth();
  const { toast } = useToast();

  const mapRef = useMapDraw({ updateArea });
  const [open, setOpen] = useState(false);

  const { data, isLoading: isFarmerLoading } = useGetFarmers({
    token: user?.accessToken ?? "",
  });

  const form = useForm<CreateFarmInput>({
    resolver: zodResolver(createFarmSchema),
    defaultValues: { ownerId: "", hectar: 0, proof: "", coordinates: [] },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: createFarm,
    onSuccess: ({ data }) => {
      toast({
        title: "Created",
        description: `Farm ${data._id} created successfully!`,
      });
      queryClient.invalidateQueries([QUERY_FARMERS_KEY]);
      queryClient.setQueriesData<Farm[]>([QUERY_FARMS_KEY], (items) => {
        if (items) {
          return [data, ...items];
        }
        return items;
      });
      navigate("/dashboard/farms");
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  const selectedFarmer = data?.find(
    (item) => item._id === form.getValues("ownerId"),
  );

  function updateArea(e: DrawEvent) {
    const coordinates = coordinatesSchema.parse(
      e.features[0].geometry.coordinates,
    );
    form.reset((prev) => ({ ...prev, coordinates }));
  }

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
              }),
            )}
          >
            Cancel
          </Link>
          <Button disabled={isLoading} onClick={form.handleSubmit(onSubmit)}>
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
        className="grid grid-cols-3 gap-4"
      >
        <div className="h-[80vh] col-span-2 overflow-hidden" ref={mapRef} />
        <div className="pr-2">
          <Form {...form}>
            <form
              className="grid gap-4"
              // onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
            >
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
                          <CommandEmpty>No presets found.</CommandEmpty>
                          <CommandGroup heading="Farmers">
                            {data?.map((item) => (
                              <CommandItem
                                key={item._id}
                                onSelect={() => {
                                  field.onChange(item._id);
                                  setOpen(false);
                                }}
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
                name="hectar"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hectar</FormLabel>
                    <FormControl>
                      <Input type="number" placeholder="lastname" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="proof"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>
      </section>
      <FarmDialog />
    </Shell>
  );
}

export default FarmAddPage;
