import mapApi, { addPolygon } from "@/lib/map";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { useEffect, useRef } from "react";
import { Farm, Mortgage } from "schema";

interface UseMapViewProps {
  farms?: Farm[];
  mortgages: Mortgage[];
}

export function useMapView({ farms, mortgages }: UseMapViewProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      const map = new mapApi.Map({
        container: ref.current || "",
        center: [124.74735434277659, 7.745449162964974],
        zoom: 11.259085067438566,
        style: "mapbox://styles/mapbox/satellite-streets-v12",
      });

      map.addControl(new mapApi.NavigationControl(), "bottom-right");

      map.on("load", ({ target }) => {
        farms?.forEach((farm) =>
          addPolygon({
            target,
            farm,
            mortage: mortgages?.find(
              (item) => item.farm._id === farm._id && item.status === "Active"
            ),
          })
        );
      });

      return () => {
        map.remove();
      };
    }
  }, [ref, farms]);

  return ref;
}
