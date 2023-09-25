import { MAP_POLYGON_KEY } from "@/constant/map.constant";
import { DrawEvent } from "@/types";
import { Coordinates } from "@/types/farm.type";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYnJpeDEwMSIsImEiOiJjbDlvOHRnMGUwZmlrM3VsN21hcTU3M2IyIn0.OR9unKhFFMKUmDz7Vsz4TQ";

export function MapContainer() {
  const ref = useRef<HTMLDivElement | null>(null);

  const polygonCoordinates = [
    [
      [124.74910258726203, 7.725352264365313],
      [124.74868544290376, 7.7216755352504265],
      [124.74477745891977, 7.722165042452389],
      [124.7434491834635, 7.724264478020004],
      [124.74523851320919, 7.72573298892496],
      [124.74605084695855, 7.7281043513099235],
      [124.74940995678901, 7.727658362153107],
      [124.74910258726203, 7.725352264365313],
    ],
  ];

  const median = findCenter(polygonCoordinates as Coordinates);

  useEffect(() => {
    if (ref?.current && typeof ref?.current !== undefined) {
      const map = new mapboxgl.Map({
        container: ref?.current || "",
        center: [124.74735434277659, 7.745449162964974],
        zoom: 13.259085067438566,
        style: "mapbox://styles/mapbox/satellite-streets-v12",
      });
      const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
          polygon: true,
          trash: true,
        },
        // defaultMode: "draw_polygon",
      });
      map.addControl(draw);
      map.addControl(new mapboxgl.NavigationControl(), "bottom-right");

      map.on("load", ({ target }) => {
        target.addLayer({
          id: MAP_POLYGON_KEY,
          type: "line",
          source: {
            type: "geojson",
            data: {
              type: "Feature",
              properties: {},
              geometry: {
                type: "Polygon",
                coordinates: polygonCoordinates,
              },
            },
          },
          paint: {
            "line-color": "#FFA500",
            "line-width": 4,
          },
        });
        target.on("draw.create", updateArea);
        target.on("draw.delete", updateArea);
        target.on("draw.update", updateArea);

        map.flyTo({
          center: median,
          zoom: 13.259085067438566,
        });
      });
    }
  }, [ref, polygonCoordinates]);
  function updateArea(event: DrawEvent) {
    console.log(event);
  }
  return <div className="h-screen w-full overflow-hidden" ref={ref} />;
}

interface UseMapContainerProps {
  coordinares?: Coordinates;
  mode?: "view" | "edit";
  updateArea?: (event: DrawEvent) => void;
}

export function useMapDraw({
  coordinares,
  mode,
  updateArea,
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
        if (updateArea) {
          target.on("draw.create", updateArea);
          target.on("draw.delete", updateArea);
          target.on("draw.update", updateArea);
        }

        if (coordinares) {
          map.flyTo({
            center: findCenter(coordinares),
            zoom: 16.259085067438566,
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
        if (updateArea) {
          map.off("draw.create", updateArea);
          map.off("draw.delete", updateArea);
          map.off("draw.update", updateArea);
        }
        map.remove();
      };
    }
  }, [ref, coordinares, mode]);

  return ref;
}

function findCenter(coordinates: Coordinates): { lng: number; lat: number } {
  // Extract the lng and lat values separately
  const lngArray = coordinates[0].map((coord) => coord[0]);
  const latArray = coordinates[0].map((coord) => coord[1]);

  // Sort the arrays
  const sortedLng = [...lngArray].sort((a, b) => a - b);
  const sortedLat = [...latArray].sort((a, b) => a - b);

  const length = sortedLng.length;

  // Calculate the median
  if (length % 2 === 0) {
    // If the length is even, average the two middle values
    const middleLng1 = sortedLng[length / 2 - 1];
    const middleLng2 = sortedLng[length / 2];
    const middleLat1 = sortedLat[length / 2 - 1];
    const middleLat2 = sortedLat[length / 2];
    return {
      lng: (middleLng1 + middleLng2) / 2,
      lat: (middleLat1 + middleLat2) / 2,
    };
  } else {
    // If the length is odd, return the middle values
    return {
      lng: sortedLng[Math.floor(length / 2)],
      lat: sortedLat[Math.floor(length / 2)],
    };
  }
}
