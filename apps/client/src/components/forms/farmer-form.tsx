import { Icons } from "@/components/icons";
import {
  BarangaySelect,
  CitySelect,
  ProvinceSelect,
  useAddressState,
} from "@/components/select/address-select";
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
import {
  QUERY_FARMERS_KEY,
  QUERY_FARMS_KEY,
  QUERY_MORTGAGES_KEY,
  QUERY_STATISTICS_KEY,
} from "@/constant/query.constant";
import { useToast } from "@/hooks/useToast";
import { useBoundStore } from "@/lib/store";
import {
  createFarmer,
  deleteFarmer,
  updateFarmer,
} from "@/services/farmer.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UseFormReturn, useForm } from "react-hook-form";
import {
  CreateFarmerInput,
  Farmer,
  RecentAdded,
  createFarmerBody,
  farmerSchema,
} from "schema";

interface MutationProps {
  farmer: Farmer;
}

export function AddFarmerForm() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { resetState } = useAddressState();
  const { setDialogItem } = useBoundStore((state) => state.dialog);

  const form = useForm<CreateFarmerInput>({
    resolver: zodResolver(createFarmerBody),
    defaultValues: {
      firstname: "",
      lastname: "",
      middleInitial: "",
      address: {
        streetAddress: "",
        cityOrProvince: "",
        municipality: "",
        barangay: "",
        zipcode: "",
      },
      phoneNumber: "",
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: createFarmer,
    onSuccess: ({ data }) => {
      const newFarmer = farmerSchema.parse(data);
      queryClient.setQueriesData<RecentAdded>(
        [QUERY_STATISTICS_KEY, "recent"],
        (items) => {
          if (items) {
            return {
              count: items.count + 1,
              todayFarmers: [newFarmer, ...items.todayFarmers.slice(0, 4)],
            };
          }
          return items;
        },
      );
      queryClient.setQueriesData<Farmer[]>([QUERY_FARMERS_KEY], (items) => {
        if (items) {
          return [newFarmer, ...items];
        }
        return items;
      });
      resetState();
      setDialogItem();
      toast({
        title: "Add",
        description: `Farmer ${data.lastname} add successfully!`,
      });
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  function onSubmit(data: CreateFarmerInput) {
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

export function UpdateFarmerForm({ farmer }: MutationProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { resetState } = useAddressState();
  const { setDialogItem } = useBoundStore((state) => state.dialog);

  const form = useForm<CreateFarmerInput>({
    resolver: zodResolver(createFarmerBody),
    defaultValues: {
      ...farmer,
      middleInitial: farmer.middleInitial ?? "",
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: updateFarmer,
    onSuccess: ({ data }) => {
      const upFarmer = farmerSchema.parse(data);
      queryClient.setQueriesData<Farmer[]>([QUERY_FARMERS_KEY], (items) => {
        if (items) {
          return items.map((item) => {
            if (item._id === upFarmer._id) {
              return { ...upFarmer, totalSize: item.totalSize };
            }
            return item;
          });
        }
        return items;
      });
      resetState();
      setDialogItem();
      toast({
        title: "Updated",
        description: `Farmer ${data.lastname} updated successfully!`,
      });
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  function onSubmit(data: CreateFarmerInput) {
    mutate({ id: farmer?._id as string, data });
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

export function DeleteFarmerForm({ farmer }: MutationProps) {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { setDialogItem } = useBoundStore((state) => state.dialog);

  const { mutate, isLoading } = useMutation({
    mutationFn: deleteFarmer,
    onSuccess: () => {
      queryClient.setQueriesData<Farmer[]>([QUERY_FARMERS_KEY], (prev) => {
        if (prev) {
          return prev.filter((item) => item._id !== farmer?._id);
        }
        return prev;
      });
      queryClient.invalidateQueries([QUERY_MORTGAGES_KEY]);
      queryClient.invalidateQueries([QUERY_FARMS_KEY]);
      queryClient.invalidateQueries([QUERY_STATISTICS_KEY, "recent"]);

      setDialogItem();
      toast({
        title: "Deleted",
        description: `Farmer ${farmer?._id} deleted successfully!`,
      });
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  function handleDeleteClick() {
    mutate(farmer?._id ?? "");
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
  form: UseFormReturn<CreateFarmerInput, any, undefined>;
  isLoading: boolean;
  onSubmit(data: CreateFarmerInput): void;
  buttonLabel: "Add" | "Update";
}) {
  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <div className="grid grid-cols-7 gap-4">
          <div className="col-span-3">
            <FormField
              control={form.control}
              name="firstname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Firstname</FormLabel>
                  <FormControl>
                    <Input placeholder="firstname" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-3">
            <FormField
              control={form.control}
              name="lastname"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Lastname</FormLabel>
                  <FormControl>
                    <Input placeholder="lastname" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="col-span-1">
            <FormField
              control={form.control}
              name="middleInitial"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>MI.</FormLabel>
                  <FormControl>
                    <Input placeholder="mi" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input placeholder="phone number" {...field} />
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
        <div className="grid grid-cols-2 gap-4">
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
