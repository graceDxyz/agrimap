import { QUERY_USERS_KEY } from "@/constant/query.constant";
import { ActiveUser } from "@/lib/validations/user";
import { useQuery } from "@tanstack/react-query";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";
import MapboxDraw, { DrawEventType } from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYnJpeDEwMSIsImEiOiJjbDlvOHRnMGUwZmlrM3VsN21hcTU3M2IyIn0.OR9unKhFFMKUmDz7Vsz4TQ";

// Define a type for the draw object

// Define a type for the event object
type DrawEvent = {
  features: GeoJSON.Feature[];
  action: DrawEventType;
  points: number;
};

export function MapContainer() {
  const { data } = useQuery<ActiveUser>([QUERY_USERS_KEY]);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref?.current && typeof ref?.current !== undefined && data) {
      const map = new mapboxgl.Map({
        container: ref?.current || "",
        center: [125.01129701742406, 7.747423241099526],
        zoom: 17.15,
        // pitch: 50.13,
        // bearing: 112.02,
        style: "mapbox://styles/mapbox/satellite-v9",
      });
      const draw = new MapboxDraw({
        displayControlsDefault: false,
        // Select which mapbox-gl-draw control buttons to add to the map.
        controls: {
          polygon: true,
          trash: true,
        },
        // Set mapbox-gl-draw to draw by default.
        // The user does not have to click the polygon control button first.
        defaultMode: "draw_polygon",
      });

      map.addControl(draw);

      map.on("draw.create", updateArea);
      map.on("draw.delete", updateArea);
      map.on("draw.update", updateArea);

      function updateArea(event: DrawEvent) {
        console.log(event);
      }
      // newMap.addControl(new mapboxgl.NavigationControl(), "bottom-right");
    }
  }, [ref]);

  return <div className="h-screen w-full overflow-hidden" ref={ref} />;
}
