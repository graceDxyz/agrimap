import { FarmGenericForm } from "@/components/forms/farm-form";
import { Icons } from "@/components/icons";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { useAddressState } from "@/components/select/address-select";
import { Shell } from "@/components/shells/shell";
import { Button, buttonVariants } from "@/components/ui/button";
import { QUERY_FARMERS_KEY, QUERY_FARMS_KEY } from "@/constant/query.constant";
import { useMapDraw } from "@/hooks/useMapDraw";
import { useToast } from "@/hooks/useToast";
import { useUser } from "@/hooks/useUser";
import { cn } from "@/lib/utils";
import { farmLoader, updateFarm } from "@/services/farm.service";
import { DrawEvent } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Link,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  CreateFarmInput,
  Farm,
  coordinatesSchema,
  createFarmBody,
  farmSchema,
} from "schema";

function FarmAreaPage() {
  const { user } = useUser();
  const location = useLocation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { resetState } = useAddressState();

  const isAdmin = user?.role === "ADMIN";
  const isEditMode = location.pathname.includes("edit");

  const farmData = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof farmLoader>>
  >;

  const form = useForm<CreateFarmInput>({
    resolver: zodResolver(createFarmBody),
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
      crops: [],
    },
  });

  const { mutate, isLoading } = useMutation({
    mutationFn: updateFarm,
    onSuccess: ({ data }) => {
      const updateFarm = farmSchema.parse(data);
      resetState();
      toast({
        title: "Updated",
        description: `Farm ${updateFarm._id} updated successfully!`,
      });
      queryClient.invalidateQueries([QUERY_FARMERS_KEY]);
      queryClient.setQueriesData<Farm[]>([QUERY_FARMS_KEY], (items) => {
        if (items) {
          return items.map((item) => {
            if (item._id === updateFarm._id) {
              return { ...updateFarm, isMortgage: item.isMortgage };
            }
            return item;
          });
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
          { shouldFocus: true },
        );
      }
    },
  });

  const mapRef = useMapDraw({
    coordinates: farmData?.coordinates ?? form.getValues("coordinates"),
    farmMortgages: farmData?.mortgages,
    mode: isEditMode ? "edit" : "view",
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

  function onSubmit(data: CreateFarmInput) {
    mutate({ id: farmData?._id ?? "", data });
  }

  useEffect(() => {
    if (farmData) {
      form.reset({ ...farmData, ownerId: farmData.owner._id });
    }
  }, [farmData, form, isEditMode]);

  useEffect(() => {
    resetState();
  }, [resetState]);

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
          <Button
            onClick={() =>
              navigate(
                `/dashboard/farms${isEditMode ? `/${farmData?._id}` : ""}`,
              )
            }
            variant={"outline"}
            size={"sm"}
          >
            {isEditMode ? "Cancel" : "Back"}
          </Button>

          {isAdmin ? (
            <>
              {isEditMode ? (
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
                    <Icons.penLine
                      className="mr-2 h-4 w-4"
                      aria-hidden="true"
                    />
                  )}
                  Update
                  <span className="sr-only">Update</span>
                </Button>
              ) : (
                <>
                  {" "}
                  <Link
                    aria-label="cancel add"
                    to={`/dashboard/land-status/add`}
                    state={farmData}
                    className={cn(
                      buttonVariants({
                        variant: "secondary",
                        size: "sm",
                      }),
                    )}
                  >
                    Mortgage
                  </Link>
                  <Link
                    aria-label="cancel add"
                    to={`/dashboard/farms/${farmData?._id}/edit`}
                    className={cn(
                      buttonVariants({
                        size: "sm",
                      }),
                    )}
                  >
                    Edit
                  </Link>
                </>
              )}
            </>
          ) : undefined}
        </div>
        <PageHeaderDescription size="sm">
          {isEditMode ? "Update" : "View"} a farm
        </PageHeaderDescription>
      </PageHeader>
      <section
        id="dashboard-farms"
        aria-labelledby="dashboard-farms-heading"
        className="grid grid-cols-5 gap-4 relative"
      >
        <div className="absolute bottom-1 left-1 z-20 bg-white p-2 rounded-lg space-y-5">
          <h3 className="font-semibold leading-none tracking-tight">Legend</h3>
          <div>
            <div className="flex gap-2 items-center">
              <div
                className={cn(
                  " w-10 h-3",
                  isEditMode ? "bg-[#03a5fc]" : "bg-[#42F56F]",
                )}
              ></div>
              Farm area
            </div>
            <div className="flex gap-2 items-center">
              <div className="bg-[#FFA500] w-10 h-3"></div>Mortgage area
            </div>
          </div>
        </div>
        <div
          className="h-[calc(100vh-10rem)] col-span-3 overflow-hidden"
          ref={mapRef}
        />
        <FarmGenericForm form={form} isEditMode={isEditMode} />
      </section>
    </Shell>
  );
}

export default FarmAreaPage;
