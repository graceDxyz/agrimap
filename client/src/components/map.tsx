import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { useEffect, useRef, useState } from "react";
import MapboxDraw, { DrawEventType } from "@mapbox/mapbox-gl-draw";
import "@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css";
import { MAP_POLYGON_BORDER_KEY } from "@/constant/map.constant";

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

  const center = calculatePolygonCenter(polygonCoordinates[0]);
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

      function updateArea(event: DrawEvent) {
        console.log(event);
      }
    }
  }, [ref]);

  return <div className="h-screen w-full overflow-hidden" ref={ref} />;
}

function calculatePolygonCenter(coordinates: number[][]): number[] {
  let x = 0;
  let y = 0;
  let z = 0;

  for (const point of coordinates) {
    const latitude = (point[1] * Math.PI) / 180;
    const longitude = (point[0] * Math.PI) / 180;

    x += Math.cos(latitude) * Math.cos(longitude);
    y += Math.cos(latitude) * Math.sin(longitude);
    z += Math.sin(latitude);
  }

  const totalPoints = coordinates.length;
  x = x / totalPoints;
  y = y / totalPoints;
  z = z / totalPoints;

  const centralLongitude = Math.atan2(y, x);
  const centralSquareRoot = Math.sqrt(x * x + y * y);
  const centralLatitude = Math.atan2(z, centralSquareRoot);

  return [
    (centralLongitude * 180) / Math.PI,
    (centralLatitude * 180) / Math.PI,
  ];
}
