import { FarmDialog } from "@/components/forms/farm-form";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Shell } from "@/components/shells/shell";
import { Button, buttonVariants } from "@/components/ui/button";
import { useMapContainer } from "@/components/map";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { DrawEvent } from "@/types";

function FarmsPage() {
  const mapRef = useMapContainer({ updateArea });

  function updateArea(e: DrawEvent) {
    console.log(e);
  }

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
              }),
            )}
          >
            Cancel
          </Link>
          <Button size="sm">Add farm</Button>
        </div>
        <PageHeaderDescription size="sm">Add a new farm</PageHeaderDescription>
      </PageHeader>
      <section
        id="dashboard-farms"
        aria-labelledby="dashboard-farms-heading"
        className="grid grid-cols-3 gap-4"
      >
        <div className="h-[80vh] col-span-2 overflow-hidden" ref={mapRef} />
        <div className="h-full bg-red-200"></div>
      </section>
      <FarmDialog />
    </Shell>
  );
}

export default FarmsPage;
