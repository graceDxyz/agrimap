import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { Shell } from "@/components/shells/shell";
import { useMapView } from "@/hooks/useMapView";
import { useGetFarms } from "@/services/farm.service";
import { useGetFarmers } from "@/services/farmer.service";
import { mapLoader } from "@/services/statistic.service";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import Select from "react-select";

interface Option {
  value: string;
  label: string;
}

function MapPage() {
  const { farmers: initFarmers, farms: initFarms } = useLoaderData() as Awaited<
    ReturnType<ReturnType<typeof mapLoader>>
  >;
  const { data: farmsData } = useGetFarms({ initialData: initFarms });
  const { data: farmersData, isLoading: isFarmerLoading } = useGetFarmers({
    initialData: initFarmers,
  });
  const [farmer, setFarmer] = useState<Option | undefined>(undefined);
  const farmerOptions: Option[] =
    farmersData?.map((farmer) => ({
      value: farmer._id,
      label: farmer.fullName,
    })) ?? [];

  const farms =
    farmsData?.filter(
      (farm) =>
        !farm.isArchived && (!farmer || farmer.value === farm.owner._id),
    ) || [];

  const mapRef = useMapView({ farms });

  return (
    <Shell variant="sidebar">
      <PageHeader
        id="map-stores-page-header"
        aria-labelledby="map-stores-page-header-heading"
      >
        <div className="flex items-center justify-between space-y-2">
          <PageHeaderHeading size="sm" className="flex-1">
            Map
          </PageHeaderHeading>
        </div>
      </PageHeader>
      <section
        id="map-stores-page-stores"
        aria-labelledby="map-stores-page-stores-heading"
        className="relative"
      >
        <div className="absolute top-1 left-1 z-20 w-[400px]">
          <Select
            isClearable
            isSearchable
            isLoading={isFarmerLoading}
            options={farmerOptions}
            value={farmer}
            onChange={(e) => {
              setFarmer(e as Option);
            }}
          />
        </div>
        <div className="absolute bottom-1 left-1 z-20 bg-white p-2 rounded-lg space-y-5">
          <h3 className="font-semibold leading-none tracking-tight">Legend</h3>
          <div>
            <div className="flex gap-2 items-center">
              <div className="bg-[#42F56F] w-10 h-3"></div>Farm area
            </div>
            {/* <div className="flex gap-2 items-center"> */}
            {/*   <div className="bg-[#77aff7] w-10 h-3"></div>Mortgage area */}
            {/* </div> */}
            <div className="flex gap-2 items-center">
              <div className="bg-[#FFA500] w-10 h-3"></div>Mortgage area
            </div>
          </div>
        </div>
        <div
          className="h-[calc(100vh-10rem)] col-span-3 overflow-hidden"
          ref={mapRef}
        />
      </section>
    </Shell>
  );
}

export default MapPage;
