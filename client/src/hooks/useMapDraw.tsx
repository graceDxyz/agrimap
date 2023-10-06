import { MAP_POLYGON_KEY } from "@/constant/map.constant";
import { DrawEvent } from "@/types";
import { Coordinates } from "@/types/farm.type";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import * as turf from "@turf/turf";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";

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
