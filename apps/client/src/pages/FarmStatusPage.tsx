import { FarmStatusGenericForm } from "@/components/forms/farm-status-form";
import { Icons } from "@/components/icons";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Shell } from "@/components/shells/shell";
import { Button } from "@/components/ui/button";
import {
  QUERY_FARMERS_KEY,
  QUERY_FARMS_KEY,
  QUERY_MORTGAGES_KEY,
  QUERY_STATISTICS_KEY,
} from "@/constant/query.constant";
import { useMapDrawMulti } from "@/hooks/useMapDrawMulti";
import { useToast } from "@/hooks/useToast";
import { farmLoader } from "@/services/farm.service";
import { createMortgage } from "@/services/mortgage.service";
import { DrawEvent } from "@/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addMonths } from "date-fns";
import { useForm } from "react-hook-form";
import { useLoaderData, useNavigate } from "react-router-dom";
import {
  CreateMortgageInput,
  Farm,
  Farmer,
  Mortgage,
  coordinatesSchema,
  createMortgageBody,
  mortgageSchema,
} from "schema";

function FarmStatusPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const farmData = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof farmLoader>>
  >;

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
      toast({
        title: "Added",
        description: `Mortgage ${data._id} added successfully!`,
      });
      navigate(`/dashboard/farms`);
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  const form = useForm<CreateMortgageInput>({
    resolver: zodResolver(createMortgageBody),
    defaultValues: {
      status: "Active",
      farmId: farmData?._id,
      mortgageToId: "",
      mortgageAmount: 0,
      mortgageDate: {
        from: new Date().toString(),
        to: addMonths(new Date(), 1).toString(),
      },
      proofFiles: [],
      coordinates: [],
      size: 0,
    },
  });

  const mapRef = useMapDrawMulti({
    mode: "edit",
    mainCoordinates: farmData?.coordinates,
    activeCoordinates: form.getValues("coordinates"),
    farmMortgages: farmData.mortgages,
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

  function onSubmit(data: CreateMortgageInput) {
    mutate(data);
  }

  return (
    <Shell variant="sidebar">
      <PageHeader
        id="dashboard-stores-page-header"
        aria-labelledby="dashboard-stores-page-header-heading"
      >
        <div className="flex space-x-4">
          <PageHeaderHeading size="sm" className="flex-1">
            Mortgage Farm
          </PageHeaderHeading>
          <Button onClick={() => navigate(-1)} variant={"outline"} size={"sm"}>
            Cancel
          </Button>
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
        <PageHeaderDescription size="sm">Mortgage a farm</PageHeaderDescription>
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
        <FarmStatusGenericForm
          form={form}
          onSubmit={onSubmit}
          isEditMode={true}
        />
      </section>
    </Shell>
  );
}

export default FarmStatusPage;
