import { Request, Response } from "express";
import fs from "fs";
import path from "path";
import { db } from "../db";
import {
  Barangay,
  City,
  Province,
  barangays,
  cities,
  provinces,
} from "../db/schema";
import { GetAddressInput } from "../types/address.types";

const dataDirectory = path.join(__dirname, "..", "json");
const provFilePath = path.join(dataDirectory, "provinces.json");
const cityFilePath = path.join(dataDirectory, "cities.json");
const bgyFilePath = path.join(dataDirectory, "barangays.json");

export const getAddressHandler = async (req: Request, res: Response) => {
  try {
    const provRes = db.select().from(provinces).all();
    const citRes = db.select().from(cities).all();
    const brgyRes = db.select().from(barangays).all();

    res.json({ provinces: provRes, cities: citRes, barangays: brgyRes });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error parsing JSON data");
  }
};

export const seedAddressHandler = async (req: Request, res: Response) => {
  try {
    // const [provJson, cityJson, brgyJson] = await Promise.all([
    //   readFilePromise<Province>(provFilePath),
    //   readFilePromise<City>(cityFilePath),
    //   readFilePromise<Barangay>(bgyFilePath),
    // ]);

    // const chunkSize = 1000;
    // const data = cityJson.data ?? [];
    // for (let i = 0; i < data.length; i += chunkSize) {
    //   const chunk = data.slice(i, i + chunkSize);
    //   await db.insert(cities).values(chunk);
    // }

    // for (let i = 0; i < data.length; i += chunkSize) {
    //   const chunk = data.slice(i, i + chunkSize);
    //   await db.insert(barangays).values(chunk);
    // }

    res.send();
  } catch (err) {
    console.error(err);
    res.status(500).send("Error parsing JSON data");
  }
};

export const getProvincesHandler = async (req: Request, res: Response) => {
  try {
    const jsonData: Province[] =
      (await readFilePromise<Province>(provFilePath)).data ?? [];
    const paginatedData = paginateAndFilter(jsonData, req);
    res.json(paginatedData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error parsing JSON data");
  }
};

export const getProvinceHandler = async (
  req: Request<GetAddressInput["params"]>,
  res: Response,
) => {
  try {
    const psgcCode = req.params.psgcCode;

    const data: City[] = (await readFilePromise<City>(cityFilePath)).data ?? [];

    const jsonData = data.filter((item) => item.provinceCode === psgcCode);

    const paginatedData = paginateAndFilter(jsonData, req);
    res.json(paginatedData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error parsing JSON data");
  }
};

export const getCitiesHandler = async (req: Request, res: Response) => {
  try {
    const jsonData: City[] =
      (await readFilePromise<City>(cityFilePath)).data ?? [];
    const paginatedData = paginateAndFilter(jsonData, req);
    res.json(paginatedData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error parsing JSON data");
  }
};

export const getCityHandler = async (
  req: Request<GetAddressInput["params"]>,
  res: Response,
) => {
  try {
    const psgcCode = req.params.psgcCode;

    const data: Barangay[] =
      (await readFilePromise<Barangay>(bgyFilePath)).data ?? [];

    const jsonData = data.filter((item) => item.cityMunCode === psgcCode);
    const paginatedData = paginateAndFilter(jsonData, req);
    res.json(paginatedData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error parsing JSON data");
  }
};

export const getBarangaysHandler = async (req: Request, res: Response) => {
  try {
    const jsonData: Barangay[] =
      (await readFilePromise<Barangay>(bgyFilePath)).data ?? [];
    const paginatedData = paginateAndFilter(jsonData, req);
    res.json(paginatedData);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error parsing JSON data");
  }
};
const readFilePromise = <
  T extends { label: string; name: string; value: string },
>(
  filePath: string,
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

function paginateAndFilter<T extends { name: string }>(
  data: T[],
  req: Request,
): T[] {
  data.sort((a: T, b: T) => {
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
    ? data.filter((item: T) =>
        Object.values(item).some((value) =>
          value.toString().toLowerCase().includes(filter.toLowerCase()),
        ),
      )
    : data;

  // Calculate the start and end indexes for pagination
  const startIndex = (page - 1) * perPage;
  const endIndex = startIndex + perPage;

  // Get the data for the current page
  const paginatedData = filteredData
    .slice(startIndex, endIndex)
    .filter((item) => item.name.trim().length > 0);

  return paginatedData;
}
