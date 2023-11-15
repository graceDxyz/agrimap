import { MAP_POLYGON_KEY } from "@/constant/map.constant";
import { mortgageAreaPolygon, newMap } from "@/lib/map";
import { DrawEvent } from "@/types";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import * as turf from "@turf/turf";
import { useEffect, useRef } from "react";
import { Coordinates, FarmMortgage } from "schema";

interface UseMapContainerProps {
  mainCoordinates?: Coordinates;
  activeCoordinates?: Coordinates;
  farmMortgages?: Array<FarmMortgage>;
  mode?: "view" | "edit";
  onUpdateArea?: (event: DrawEvent) => void;
  onCalculateArea?: (event: number) => void;
}

export function useMapDrawMulti({
  mainCoordinates,
  activeCoordinates,
  farmMortgages,
  mode,
  onUpdateArea,
  onCalculateArea,
}: UseMapContainerProps) {
  const ref = useRef<HTMLDivElement | null>(null);
  const drawRef = useRef<MapboxDraw | null>(null);

  useEffect(() => {
    if (ref.current) {
      const map = newMap({ ref, coordinates: mainCoordinates });

      const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true,
        },
        // defaultMode: "",
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
          if (onUpdateArea) onUpdateArea(e);
          if (onCalculateArea) onCalculateArea(turf.area(draw.getAll()));
        }

        if (mainCoordinates) {
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
                  coordinates: mainCoordinates,
                },
              },
            },
            paint: {
              "line-color": "#42F56F",
              "line-width": 4,
            },
          });
        }

        if (farmMortgages) {
          mortgageAreaPolygon({ target, mortgages: farmMortgages });
        }

        if (mode === "edit" && activeCoordinates) {
          const polygonFeature: GeoJSON.Feature<GeoJSON.Polygon> = {
            id: MAP_POLYGON_KEY,
            type: "Feature",
            properties: {},
            geometry: { type: "Polygon", coordinates: activeCoordinates },
          };

          draw.add(polygonFeature);
          draw.set({
            type: "FeatureCollection",
            features: [polygonFeature],
          });

          drawRef.current = draw;
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
  }, [ref, mainCoordinates, mode]);

  return ref;
}
