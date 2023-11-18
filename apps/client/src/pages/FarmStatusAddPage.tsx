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
import { useToast } from "@/hooks/useToast";
import { createMortgage } from "@/services/mortgage.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addMonths } from "date-fns";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";
import {
  CreateMortgageInput,
  Farm,
  Farmer,
  Mortgage,
  createMortgageBody,
  farmMortgageSchema,
  mortgageSchema,
} from "schema";

function FarmStatusAddPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const initialData = location.state as Farm;

  const { mutate, isLoading } = useMutation({
    mutationFn: createMortgage,
    onSuccess: ({ data }) => {
      const newMortgage = mortgageSchema.parse(data);
      const farmMortgage = farmMortgageSchema.parse(data);
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
              return {
                ...item,
                mortgages: [...item.mortgages, farmMortgage],
                isMortgage: true,
              };
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
      farmId: initialData?._id ?? "",
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
            Land status
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
        <PageHeaderDescription size="sm">
          Add mortgage a farm
        </PageHeaderDescription>
      </PageHeader>
      <section
        id="dashboard-farms"
        aria-labelledby="dashboard-farms-heading"
        className="grid grid-cols-5 gap-4 relative"
      >
        <div className="absolute top-1 left-1 z-20 bg-white p-2 rounded-lg space-y-5">
          <h3 className="font-semibold leading-none tracking-tight">Legend</h3>
          <div>
            <div className="flex gap-2 items-center">
              <div className="bg-[#42F56F] w-10 h-3"></div>Farm area
            </div>
            <div className="flex gap-2 items-center">
              <div className="bg-[#FFA500] w-10 h-3"></div>Mortgage area
            </div>
          </div>
        </div>
        <FarmStatusGenericForm form={form} onSubmit={onSubmit} isEditMode />
      </section>
    </Shell>
  );
}

export default FarmStatusAddPage;
