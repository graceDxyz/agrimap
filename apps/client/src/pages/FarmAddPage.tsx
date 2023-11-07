import { FarmDialog, FarmGenericForm } from "@/components/forms/farm-form";
import { Icons } from "@/components/icons";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { useAddressState } from "@/components/select/address-select";
import { Shell } from "@/components/shells/shell";
import { Button, buttonVariants } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { QUERY_FARMERS_KEY, QUERY_FARMS_KEY } from "@/constant/query.constant";
import { useMapDraw } from "@/hooks/useMapDraw";
import { cn } from "@/lib/utils";
import { createFarm } from "@/services/farm.service";
import { DrawEvent } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import {
  CreateFarmInput,
  Farm,
  coordinatesSchema,
  createFarmBody,
  farmSchema,
} from "schema";

function FarmAddPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { resetState } = useAddressState();

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

  const mapRef = useMapDraw({
    mode: "edit",
    onUpdateArea: (e: DrawEvent) => {
      const coordinates = coordinatesSchema.parse(
        e.features[0].geometry.coordinates
      );
      form.reset((prev) => ({ ...prev, coordinates }));
    },
    onCalculateArea: (area: number) => {
      const size = parseFloat(area.toFixed(2)); // parseFloat((area / 10000).toFixed(2));
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

  function onSubmit(data: CreateFarmInput) {
    mutate(data);
  }

  useEffect(() => {
    resetState();
  }, []);

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
        <div
          className="h-[calc(100vh-10rem)] col-span-3 overflow-hidden"
          ref={mapRef}
        />
        <FarmGenericForm form={form} isEditMode />
      </section>
      <FarmDialog />
    </Shell>
  );
}

export default FarmAddPage;
