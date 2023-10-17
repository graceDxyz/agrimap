import { Table } from "@tanstack/react-table";

import { DataTableViewOptions } from "@/components/data-table/data-table-view-options";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useGetFarmers } from "@/services/farmer.service";
import { useGetAuth } from "@/services/session.service";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  placeHolder?: string;
  disabled?: boolean;
  facetFilter?: boolean;
}

export function DataTableToolbar<TData>({
  table,
  placeHolder,
  disabled,
  facetFilter,
}: DataTableToolbarProps<TData>) {
  const globalFilter = table.getState().globalFilter;
  const { user } = useGetAuth();
  const { data } = useGetFarmers({
    token: user?.accessToken ?? "",
    options: {
      enabled: facetFilter,
    },
  });

  const owners =
    data?.map((farmer) => ({
      label: farmer.fullName,
      value: farmer.fullName,
    })) ?? [];

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <div className="relative">
          <Icons.search className="absolute left-3 top-0 h-full w-5" />
          <Input
            placeholder={placeHolder ? placeHolder : "Filter..."}
            value={globalFilter ?? ""}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              table.setGlobalFilter(event.target.value)
            }
            className="w-40 lg:w-80 px-10"
            disabled={disabled}
          />
          {globalFilter && (
            <Button
              variant="ghost"
              size={"icon"}
              onClick={() => table.resetGlobalFilter()}
              className="absolute right-0 top-0 h-full px-3 py-1"
            >
              <Icons.close className="h-4 w-4" />
            </Button>
          )}
        </div>
        {facetFilter && (
          <>
            {table.getColumn("ownerName") && (
              <DataTableFacetedFilter
                column={table.getColumn("ownerName")}
                title="Owner"
                options={owners}
              />
            )}
          </>
        )}
      </div>
      <></>
      <DataTableViewOptions table={table} />
    </div>
  );
}
