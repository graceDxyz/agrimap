import { Request, Response } from "express";
import fs from "fs";
import path from "path";

const dataDirectory = path.join(__dirname, "..", "json");
const provFilePath = path.join(dataDirectory, "provinces.json");
const cityFilePath = path.join(dataDirectory, "cities.json");
const bgyFilePath = path.join(dataDirectory, "barangays.json");

export const getAddressHandler = async (req: Request, res: Response) => {
  try {
    const provinces = (await readFilePromise<Province>(provFilePath)).data;
    const cities = (await readFilePromise<City>(cityFilePath)).data;
    const barangays = (await readFilePromise<Barangay>(bgyFilePath)).data;

    res.json({ provinces, cities, barangays });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error parsing JSON data");
  }
};

export const getProvinceHandler = async (req: Request, res: Response) => {
  try {
    const jsonData: Province[] =
      (await readFilePromise<Province>(provFilePath)).data ?? [];

    jsonData.sort((a: Province, b: Province) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    // Pagination logic
    const page = parseInt(req.query.page as string) || 1; // Get the page parameter from the query, default to 1
    const perPage = parseInt(req.query.perPage as string) || 100; // Get the perPage parameter from the query, default to 100
    const filter = req.query.filter as string | undefined; // Get the city parameter from the query

    // Filter data by city if the 'city' parameter is provided
    const filteredData = filter
      ? jsonData.filter((item: Province) =>
          Object.values(item).some((value) =>
            value.toString().toLowerCase().includes(filter.toLowerCase())
          )
        )
      : jsonData;

    // Calculate the start and end indexes for pagination
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;

    // Get the data for the current page
    const paginatedData = filteredData.slice(startIndex, endIndex);

    res.json(paginatedData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error parsing JSON data");
  }
};

export const getCityHandler = async (req: Request, res: Response) => {
  try {
    const jsonData: City[] =
      (await readFilePromise<City>(cityFilePath)).data ?? [];

    jsonData.sort((a: City, b: City) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    // Pagination logic
    const page = parseInt(req.query.page as string) || 1; // Get the page parameter from the query, default to 1
    const perPage = parseInt(req.query.perPage as string) || 100; // Get the perPage parameter from the query, default to 10
    const filter = req.query.filter as string | undefined; // Get the city parameter from the query

    // Filter data by city if the 'city' parameter is provided
    const filteredData = filter
      ? jsonData.filter((item: City) =>
          Object.values(item).some((value) =>
            value.toString().toLowerCase().includes(filter.toLowerCase())
          )
        )
      : jsonData;

    // Calculate the start and end indexes for pagination
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;

    // Get the data for the current page
    const paginatedData = filteredData.slice(startIndex, endIndex);

    res.json(paginatedData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error parsing JSON data");
  }
};

export const getBarangayHandler = async (req: Request, res: Response) => {
  try {
    const jsonData: Barangay[] =
      (await readFilePromise<Barangay>(bgyFilePath)).data ?? [];

    jsonData.sort((a: Barangay, b: Barangay) => {
      const nameA = a.name.toLowerCase();
      const nameB = b.name.toLowerCase();

      if (nameA < nameB) {
        return -1;
      }
      if (nameA > nameB) {
        return 1;
      }
      return 0;
    });
    // Pagination logic
    const page = parseInt(req.query.page as string) || 1; // Get the page parameter from the query, default to 1
    const perPage = parseInt(req.query.perPage as string) || 100; // Get the perPage parameter from the query, default to 10
    const filter = req.query.filter as string | undefined; // Get the city parameter from the query

    // Filter data by city if the 'city' parameter is provided
    const filteredData = filter
      ? jsonData.filter((item: Barangay) =>
          Object.values(item).some((value) =>
            value.toString().toLowerCase().includes(filter.toLowerCase())
          )
        )
      : jsonData;

    // Calculate the start and end indexes for pagination
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;

    // Get the data for the current page
    const paginatedData = filteredData
      .slice(startIndex, endIndex)
      .filter((item) => item.name.trim().length > 0);

    res.json(paginatedData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error parsing JSON data");
  }
};
const readFilePromise = <
  T extends { label: string; name: string; value: string }
>(
  filePath: string
): Promise<{ data: T[] | null; error: string | null }> => {
  return new Promise<{ data: T[] | null; error: string | null }>((resolve) => {
    fs.readFile(filePath, "utf8", (err, data) => {
      if (err) {
        const error = err.message || "Internal Server Error";
        console.error(err);
        resolve({ data: null, error });
        return;
      }

      try {
        const jsonData: T[] = JSON.parse(data);
        const items = jsonData.map((item) => {
          return {
            ...item,
            label: item.name,
            value: item.name,
          };
        });
        items.sort((a, b) => {
          const nameA = a.name.toLowerCase();
          const nameB = b.name.toLowerCase();
          return nameA.localeCompare(nameB);
        });
        resolve({ data: items, error: null });
      } catch (parseError: any) {
        const error = parseError.message || "Error parsing JSON data";
        console.error(parseError);
        resolve({ data: null, error });
      }
    });
  });
};

interface Province {
  psgcCode: string;
  name: string;
  label: string;
  value: string;
}

interface City {
  psgcCode: string;
  name: string;
  provinceCode: string;
  label: string;
  value: string;
}

interface Barangay {
  psgcCode: string;
  name: string;
  provinceCode: string;
  cityMunCode: string;
  label: string;
  value: string;
}
