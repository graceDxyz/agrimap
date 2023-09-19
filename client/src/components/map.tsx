import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef } from "react";
import MapboxDraw from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { MAP_POLYGON_BORDER_KEY } from "@/constant/map.constant";
import { DrawEvent } from "@/types";

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
          id: MAP_POLYGON_BORDER_KEY,
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

        // map.flyTo({
        //   center: { lat: center[0], lng: center[1] },
        //   zoom: 13.259085067438566,
        // });
      });
    }
  }, [ref, polygonCoordinates]);
  function updateArea(event: DrawEvent) {
    console.log(event);
  }
  return <div className="h-screen w-full overflow-hidden" ref={ref} />;
}

interface UseMapContainerProps {
  updateArea?: (event: DrawEvent) => void;
}

export function useMapContainer({ updateArea }: UseMapContainerProps) {
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
          id: MAP_POLYGON_BORDER_KEY,
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
        if (updateArea) {
          target.on("draw.create", updateArea);
          target.on("draw.delete", updateArea);
          target.on("draw.update", updateArea);
        }
      });
    }
  }, [ref, polygonCoordinates]);

  return ref;
}
