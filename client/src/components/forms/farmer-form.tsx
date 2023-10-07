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
  QUERY_FARMERS_KEY,
  QUERY_FARMS_KEY,
  QUERY_MORTGAGES_KEY,
  QUERY_STATISTICS_KEY,
} from "@/constant/query.constant";
import { useBoundStore } from "@/lib/store";
import { createFarmerSchema } from "@/lib/validations/farmer";
import {
  createFarmer,
  deleteFarmer,
  updateFarmer,
} from "@/services/farmer.service";
import { useGetAuth } from "@/services/session.service";
import { DialogHeaderDetail, Mode } from "@/types";
import { CreateFarmerInput, Farmer } from "@/types/farmer.type";
import { RecentAdded } from "@/types/statistic.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

export function FarmerDialog() {
  const { user } = useGetAuth();
  const { mode } = useBoundStore((state) => state.farmer);
  const isOpen = mode !== "view";

  const modeToTitle: Record<Mode, DialogHeaderDetail> = {
    view: {
      title: "View Farmer",
      description: "View farmer details.",
    },
    create: {
      title: "Add Farmer",
      description: "add a new farmer.",
      form: <CreateForm token={user?.accessToken ?? ""} />,
    },
    update: {
      title: "Update Farmer",
      description: "Update farmer information.",
      form: <UpdateForm token={user?.accessToken ?? ""} />,
    },
    delete: {
      title: "Are you absolutely sure?",
      description: "Delete farmer data (cannot be undone).",
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
  const { setMode } = useBoundStore((state) => state.farmer);

  const form = useForm<CreateFarmerInput>({
    resolver: zodResolver(createFarmerSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
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
      const fullName = `${data.lastname}, ${data.firstname}`;
      const fullAddress = `${data.address.streetAddress}, ${data.address.barangay}, ${data.address.municipality}, ${data.address.cityOrProvince}, ${data.address.zipcode}`;
      const newFarmer = { ...data, fullName, fullAddress };
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

      handleCancelClick();
      toast({
        title: "Created",
        description: `Farmer ${data.lastname} created successfully!`,
      });
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  function onSubmit(data: CreateFarmerInput) {
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
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
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
          <div className="grid gap-2">
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
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="address.cityOrProvince"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City/Province</FormLabel>
                  <FormControl>
                    <Input placeholder="province" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="address.municipality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City/Municipality</FormLabel>
                  <FormControl>
                    <Input placeholder="city/municipality" {...field} />
                  </FormControl>
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Barangay</FormLabel>
                  <FormControl>
                    <Input placeholder="barangay" {...field} />
                  </FormControl>
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
  const { setMode, farmer } = useBoundStore((state) => state.farmer);

  const form = useForm<CreateFarmerInput>({
    resolver: zodResolver(createFarmerSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
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
    mutationFn: updateFarmer,
    onSuccess: ({ data }) => {
      queryClient.setQueriesData<Farmer[]>([QUERY_FARMERS_KEY], (items) => {
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
        description: `Farmer ${data.lastname} updated successfully!`,
      });
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  function onSubmit(data: CreateFarmerInput) {
    mutate({ token, id: farmer?._id as string, data });
  }

  function handleCancelClick() {
    setMode({ mode: "view" });
    form.reset();
  }

  useEffect(() => {
    if (farmer) {
      form.reset({
        ...farmer,
      });
    }
  }, [farmer, form]);

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
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
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="address.cityOrProvince"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Province</FormLabel>
                  <FormControl>
                    <Input placeholder="province" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid gap-2">
            <FormField
              control={form.control}
              name="address.municipality"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City/Municipality</FormLabel>
                  <FormControl>
                    <Input placeholder="city/municipality" {...field} />
                  </FormControl>
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
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Barangay</FormLabel>
                  <FormControl>
                    <Input placeholder="barangay" {...field} />
                  </FormControl>
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
  const { farmer, setMode } = useBoundStore((state) => state.farmer);

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

      handleCancelClick();
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
    mutate({ token, id: farmer?._id ?? "" });
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
