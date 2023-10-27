import { PageHeader, PageHeaderHeading } from "@/components/page-header";
import { Shell } from "@/components/shells/shell";
import { useMapView } from "@/hooks/useMapDraw";
import { useGetFarms } from "@/services/farm.service";
import { useGetFarmers } from "@/services/farmer.service";
import { mapLoader } from "@/services/loader";
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
      (farm) => !farm.isArchived && (!farmer || farmer.value === farm.owner._id)
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
        <div
          className="h-[calc(100vh-10rem)] col-span-3 overflow-hidden"
          ref={mapRef}
        />
      </section>
    </Shell>
  );
}

export default MapPage;
