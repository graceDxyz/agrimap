import { MAP_POLYGON_KEY } from "@/constant/map.constant";
import { mortgageAreaPolygon, newMap } from "@/lib/map";
import { DrawEvent } from "@/types";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { useEffect, useRef } from "react";
import { Coordinates, FarmMortgage } from "schema";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import * as turf from "@turf/turf";

interface UseMapContainerProps {
  coordinates?: Coordinates;
  farmMortgages?: Array<FarmMortgage>;
  mode?: "view" | "edit";
  onUpdateArea?: (event: DrawEvent) => void;
  onCalculateArea?: (event: number) => void;
}

export function useMapDraw({
  coordinates,
  farmMortgages,
  mode,
  onUpdateArea,
  onCalculateArea,
}: UseMapContainerProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const drawRef = useRef<MapboxDraw | null>(null);

  useEffect(() => {
    if (ref.current) {
      const map = newMap({ ref, coordinates: coordinates });

      const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true,
        },
        // defaultMode: "draw_polygon",
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

        if (coordinates) {
          if (mode === "edit") {
            const polygonFeature: GeoJSON.Feature<GeoJSON.Polygon> = {
              id: MAP_POLYGON_KEY,
              type: "Feature",
              properties: {},
              geometry: { type: "Polygon", coordinates: coordinates },
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
                    coordinates: coordinates,
                  },
                },
              },
              paint: {
                "fill-color": "#42F56F",
                "fill-opacity": 0.15,
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
                    coordinates: coordinates,
                  },
                },
              },
              paint: {
                "line-color": "#42F56F",
                "line-width": 4,
              },
            });
          }
        }

        if (farmMortgages) {
          mortgageAreaPolygon({ target, mortgages: farmMortgages });
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
  }, [ref, coordinates, mode]);

  return ref;
}
