import { FarmStatusGenericForm } from "@/components/forms/farm-status-form";
import { Icons } from "@/components/icons";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Shell } from "@/components/shells/shell";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  QUERY_FARMERS_KEY,
  QUERY_FARMS_KEY,
  QUERY_MORTGAGES_KEY,
  QUERY_STATISTICS_KEY,
} from "@/constant/query.constant";
import { useToast } from "@/hooks/useToast";
import { cn } from "@/lib/utils";
import { mortgageLoader, updateMortgage } from "@/services/mortgage.service";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import {
  useNavigate,
  useLocation,
  Link,
  useLoaderData,
} from "react-router-dom";
import {
  CreateMortgageInput,
  Mortgage,
  createMortgageBody,
  mortgageSchema,
} from "schema";

function FarmStatusPage() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();

  const mortgageData = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof mortgageLoader>>
  >;

  const isEditMode = location.pathname.includes("edit");

  const { mutate, isLoading } = useMutation({
    mutationFn: updateMortgage,
    onSuccess: async ({ data }) => {
      const upMort = mortgageSchema.parse(data);

      queryClient.setQueriesData<Mortgage[]>(
        [QUERY_MORTGAGES_KEY],
        (items) =>
          items?.map((item) => {
            if (item._id === upMort._id) {
              return upMort;
            }
            return item;
          }),
      );

      await queryClient.invalidateQueries([QUERY_FARMS_KEY]);
      await queryClient.invalidateQueries([QUERY_FARMERS_KEY]);
      await queryClient.invalidateQueries([QUERY_FARMERS_KEY]);
      await queryClient.invalidateQueries([QUERY_STATISTICS_KEY, "count"]);
      toast({
        title: "Updated",
        description: `Land status ${data._id} updated successfully!`,
      });
      navigate(`/dashboard/land-status/${mortgageData?._id}`);
    },
    onError: (error) => {
      console.log({ error });
    },
  });

  const form = useForm<CreateMortgageInput>({
    resolver: zodResolver(createMortgageBody),
    defaultValues: {
      ...mortgageData,
      farmId: mortgageData?.farm._id,
      mortgageToId: mortgageData?.mortgageTo._id,
    },
  });

  function onSubmit(data: CreateMortgageInput) {
    mutate({ id: mortgageData?._id ?? "", data });
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
          <Button
            onClick={() =>
              navigate(
                `/dashboard/land-status${
                  isEditMode ? `/${mortgageData?._id}` : ""
                } `,
              )
            }
            variant={"outline"}
            size={"sm"}
          >
            {isEditMode ? "Cancel" : "Back"}
          </Button>
          {!isEditMode ? (
            <Link
              to={`edit`}
              className={cn(
                buttonVariants({
                  size: "sm",
                }),
              )}
            >
              Edit
            </Link>
          ) : (
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
              Update
              <span className="sr-only">Update</span>
            </Button>
          )}
        </div>
        <PageHeaderDescription size="sm">
          {isEditMode ? "Edit" : "View"} mortgage a farm
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
              <div className="bg-[#42F56F] w-10 h-3"></div>Farm area
            </div>
            <div className="flex gap-2 items-center">
              <div className="bg-[#77aff7] w-10 h-3"></div>Mortgage area
            </div>
            <div className="flex gap-2 items-center">
              <div className="bg-[#FFA500] w-10 h-3"></div>Other area
            </div>
          </div>
        </div>
        <FarmStatusGenericForm
          form={form}
          onSubmit={onSubmit}
          isEditMode={isEditMode}
        />
      </section>
    </Shell>
  );
}

export default FarmStatusPage;
