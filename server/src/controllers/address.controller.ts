import { Request, Response } from "express";
import fs from "fs";
import path from "path";

const dataDirectory = path.join(__dirname, "..", "json");

export const getProvinceHandler = async (req: Request, res: Response) => {
  const filePath = path.join(dataDirectory, "provinces.json"); // Construct the absolute file path
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    try {
      const jsonData: Province[] = JSON.parse(data);
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
  });
};

export const getCityHandler = async (req: Request, res: Response) => {
  const filePath = path.join(dataDirectory, "cities.json");

  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    try {
      const jsonData: City[] = JSON.parse(data);
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
  });
};

export const getBarangayHandler = async (req: Request, res: Response) => {
  const filePath = path.join(dataDirectory, "barangays.json"); // Construct the absolute file path
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send("Internal Server Error");
      return;
    }

    try {
      const jsonData: Barangay[] = JSON.parse(data);
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
  });
};

interface Province {
  psgcCode: string;
  name: string;
}

interface City {
  psgcCode: string;
  name: string;
  provinceCode: string;
}

interface Barangay {
  psgcCode: string;
  name: string;
  provinceCode: string;
  cityMunCode: string;
}
