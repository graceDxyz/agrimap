import { Coordinates, Farm, Mortgage, FarmMortgage } from "schema";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
//@ts-ignore
import * as turf from "@turf/turf";
import mapboxgl from "mapbox-gl";
import { MAP_POLYGON_KEY } from "@/constant/map.constant";

mapboxgl.accessToken =
  "pk.eyJ1IjoiYnJpeDEwMSIsImEiOiJjbDlvOHRnMGUwZmlrM3VsN21hcTU3M2IyIn0.OR9unKhFFMKUmDz7Vsz4TQ";

export function findCenter(coordinates: Coordinates): {
  lng: number;
  lat: number;
} {
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

export function addPolygon({
  target,
  farm,
  mortage,
}: {
  target: mapboxgl.Map;
  farm: Farm;
  mortage?: Mortgage;
}) {
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
      // const propFarm = features[0].properties as Farm;
      const activeLayerId = features[0].layer.id;
      target.setFeatureState(
        {
          source: farmId,
          id: activeLayerId,
        },
        {
          clicked: true,
        },
      );

      new mapboxgl.Popup({ closeButton: false })
        .setLngLat(e.lngLat)
        .setHTML(
          `<table>
                  <tr>
                      <td class="p-2 text-gray-600 text-right font-bold">Title no.:</td>
                      <td class="p-2 text-gray-600 text-left">${
                        farm.titleNumber
                      }</td>
                  </tr>
                  <tr>
                      <td class="p-2 text-gray-600 text-right font-bold">Owner:</td>
                      <td class="p-2 text-gray-600 text-left">${
                        farm.ownerName
                      }</td>
                  </tr>
                  <tr>
                      <td class="p-2 text-gray-600 text-right font-bold">Crops:</td>
                      <td class="p-2 text-gray-600 text-left capitalize">${
                        farm.crops
                      }</td>
                  </tr>
                  ${
                    mortage
                      ? `<tr>
                      <td class="p-2 text-gray-600 text-right font-bold">Mortgage to:</td>
                      <td class="p-2 text-gray-600 text-left">${mortage.mortgageToName}</td>
                    </tr>`
                      : ""
                  }
              </table>`,
        )
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

export function mortgageAreaPolygon({
  target,
  mortgages,
}: {
  target: mapboxgl.Map;
  mortgages: Array<FarmMortgage>;
}) {
  mortgages.forEach((data) => {
    target.addLayer({
      id: MAP_POLYGON_KEY + data._id + "-fill",
      type: "fill", // Change the type to "fill"
      source: {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Polygon",
            coordinates: data.coordinates,
          },
        },
      },
      paint: {
        "fill-color": "#FFA500", // Fill color
        "fill-opacity": 0.15, // Fill opacity (adjust as needed)
      },
    });
    target.addLayer({
      id: MAP_POLYGON_KEY + data._id + "-border",
      type: "line",
      source: {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "Polygon",
            coordinates: data.coordinates,
          },
        },
      },
      paint: {
        "line-color": "#FFA500",
        "line-width": 4,
      },
    });
  });
}

export function newMap({
  ref,
  coordinates,
}: {
  ref: React.MutableRefObject<HTMLDivElement | null>;
  coordinates?: Coordinates;
}) {
  const map = new mapboxgl.Map({
    container: ref.current || "",
    center: coordinates
      ? findCenter(coordinates)
      : [124.74735434277659, 7.745449162964974],
    zoom: coordinates ? 15.259085067438566 : 13.259085067438566,
    style: "mapbox://styles/mapbox/satellite-streets-v12",
  });

  map.addControl(new mapboxgl.NavigationControl(), "bottom-right");
  return map;
}

export default mapboxgl;
