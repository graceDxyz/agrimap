import { MAP_POLYGON_KEY } from "@/constant/map.constant";
import { DrawEvent } from "@/types";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
//@ts-ignore
import * as turf from "@turf/turf";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";
import { Coordinates, Farm } from "schema";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYnJpeDEwMSIsImEiOiJjbDlvOHRnMGUwZmlrM3VsN21hcTU3M2IyIn0.OR9unKhFFMKUmDz7Vsz4TQ";

interface UseMapContainerProps {
  coordinares?: Coordinates;
  mode?: "view" | "edit";
  onUpdateArea?: (event: DrawEvent) => void;
  onCalculateArea?: (event: number) => void;
}

export function useMapDraw({
  coordinares,
  mode,
  onUpdateArea,
  onCalculateArea,
}: UseMapContainerProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const drawRef = useRef<MapboxDraw | null>(null);

  useEffect(() => {
    if (ref.current) {
      const map = new mapboxgl.Map({
        container: ref.current || "",
        center: [124.74735434277659, 7.745449162964974],
        zoom: 13.259085067438566,
        style: "mapbox://styles/mapbox/satellite-streets-v12",
      });

      map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

      const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true,
        },
        defaultMode: "draw_polygon",
      });

      if (mode === "edit") {
        map.addControl(draw);
      }

      map.on("load", ({ target }) => {
        if (onUpdateArea) {
          target.on("draw.create", drawEvent);
          target.on("draw.delete", drawEvent);
          target.on("draw.update", drawEvent);
        }

        function drawEvent(e: DrawEvent) {
          if (onUpdateArea) {
            onUpdateArea(e);
          }
          if (onCalculateArea) {
            onCalculateArea(turf.area(draw.getAll()));
          }
        }

        if (coordinares) {
          map.flyTo({
            center: findCenter(coordinares),
            zoom: 15.259085067438566,
          });

          if (mode === "edit") {
            const polygonFeature: GeoJSON.Feature<GeoJSON.Polygon> = {
              id: MAP_POLYGON_KEY,
              type: "Feature",
              properties: {},
              geometry: { type: "Polygon", coordinates: coordinares },
            };

            draw.add(polygonFeature);
            draw.set({
              type: "FeatureCollection",
              features: [polygonFeature],
            });

            drawRef.current = draw;
          } else {
            target.addLayer({
              id: MAP_POLYGON_KEY + "fill",
              type: "fill", // Change the type to "fill"
              source: {
                type: "geojson",
                data: {
                  type: "Feature",
                  properties: {},
                  geometry: {
                    type: "Polygon",
                    coordinates: coordinares,
                  },
                },
              },
              paint: {
                "fill-color": "#FFA500", // Fill color
                "fill-opacity": 0.15, // Fill opacity (adjust as needed)
              },
            });
            target.addLayer({
              id: MAP_POLYGON_KEY + "border",
              type: "line",
              source: {
                type: "geojson",
                data: {
                  type: "Feature",
                  properties: {},
                  geometry: {
                    type: "Polygon",
                    coordinates: coordinares,
                  },
                },
              },
              paint: {
                "line-color": "#FFA500",
                "line-width": 4,
              },
            });
          }
        }
      });

      return () => {
        if (onUpdateArea) {
          map.off("draw.create", onUpdateArea);
          map.off("draw.delete", onUpdateArea);
          map.off("draw.update", onUpdateArea);
        }
        map.remove();
      };
    }
  }, [ref, coordinares, mode]);

  return ref;
}

interface UseMapViewProps {
  farms?: Farm[];
}

export function useMapView({ farms }: UseMapViewProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (ref.current) {
      const map = new mapboxgl.Map({
        container: ref.current || "",
        center: [124.74735434277659, 7.745449162964974],
        zoom: 11.259085067438566,
        style: "mapbox://styles/mapbox/satellite-streets-v12",
      });

      map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

      map.on("load", ({ target }) => {
        farms?.forEach((farm) => addPolyfon({ target, farm }));
      });

      return () => {
        map.remove();
      };
    }
  }, [ref, farms]);

  return ref;
}

function findCenter(coordinates: Coordinates): { lng: number; lat: number } {
  const featureCollection: GeoJSON.FeatureCollection<
    GeoJSON.Polygon,
    GeoJSON.GeoJsonProperties
  > = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: coordinates,
        },
        properties: {
          name: "Example Polygon",
          description: "This is an example polygon feature.",
        },
      },
    ],
  };
  const center = turf.center(featureCollection);

  const newCenter = center.geometry.coordinates;

  return { lng: newCenter[0], lat: newCenter[1] };
}

function addPolyfon({ target, farm }: { target: mapboxgl.Map; farm: Farm }) {
  const coordinates = farm.coordinates;
  const farmId = farm._id;

  const layerId = farmId + "-layer";
  const crops = farm.crops.join(", ");
  // Add the combined source to the target
  target.addSource(farmId, {
    type: "geojson",
    data: {
      type: "Feature",
      properties: { ...farm, crops: crops },
      geometry: {
        type: "Polygon",
        coordinates: coordinates,
      },
    },
  });

  // Add a layer for the combined source
  target.addLayer({
    id: layerId,
    type: "fill", // Change the type to "fill"
    source: farmId, // Use the combined source
    paint: {
      "fill-color": [
        "case",
        ["boolean", ["feature-state", "clicked"], false], // Set this to false
        "#3246a8",
        "#FFA500",
      ],
      "fill-opacity": 0.15, // Fill opacity (adjust as needed)
    },
  });

  // Add a border layer for the combined source
  target.addLayer({
    id: farmId + "combinedBorder",
    type: "line",
    source: farmId, // Use the combined source
    paint: {
      "line-color": "#FFA500",
      "line-width": 4,
    },
  });

  target.on("click", layerId, function (e: mapboxgl.MapLayerMouseEvent) {
    const features = e.features ?? [];
    if (features.length > 0) {
      const propFarm = features[0].properties as Farm;
      const activeLayerId = features[0].layer.id;
      target.setFeatureState(
        {
          source: farmId,
          id: activeLayerId,
        },
        {
          clicked: true,
        }
      );

      new mapboxgl.Popup({ closeButton: false })
        .setLngLat(e.lngLat)
        .setHTML(popOverStyle(propFarm))
        .setMaxWidth("400px") // Set the maximum width of the popup
        .addTo(target);
    }
  });

  target.on("mouseenter", layerId, () => {
    target.getCanvas().style.cursor = "pointer";
  });

  // Change the cursor back to a pointer
  // when it leaves the states layer.
  target.on("mouseleave", layerId, () => {
    target.getCanvas().style.cursor = "";
  });
}

function popOverStyle(farm: Farm) {
  return `<table>
    <tr>
        <td class="p-2 text-gray-600 text-right font-bold">Title no.:</td>
        <td class="p-2 text-gray-600 text-left">${farm.titleNumber}</td>
    </tr>
    <tr>
        <td class="p-2 text-gray-600 text-right font-bold">Owner:</td>
        <td class="p-2 text-gray-600 text-left">${farm.ownerName}</td>
    </tr>
    <tr>
        <td class="p-2 text-gray-600 text-right font-bold">Crops:</td>
        <td class="p-2 text-gray-600 text-left">${farm.crops}</td>
    </tr>
</table>`;
}
