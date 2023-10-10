import { FarmerData } from "@/types/statistic.type";
import { useEffect, useState } from "react";

function useRandomData() {
  const [data, setRandomData] = useState<FarmerData[]>([]);

  const generateRandomData = () => {
    const placeholderData: FarmerData[] = [
      {
        _id: "",
        count: Math.floor(Math.random() * 5000) + 1000,
      },
      {
        _id: "",
        count: Math.floor(Math.random() * 5000) + 1000,
      },
      {
        _id: "",
        count: Math.floor(Math.random() * 5000) + 1000,
      },
      {
        _id: "",
        count: Math.floor(Math.random() * 5000) + 1000,
      },
      {
        _id: "",
        count: Math.floor(Math.random() * 5000) + 1000,
      },
      {
        _id: "",
        count: Math.floor(Math.random() * 5000) + 1000,
      },
      {
        _id: "",
        count: Math.floor(Math.random() * 5000) + 1000,
      },
      // {
      //   _id: "",
      //   count: Math.floor(Math.random() * 5000) + 1000,
      // },
      // {
      //   _id: "",
      //   count: Math.floor(Math.random() * 5000) + 1000,
      // },
      // {
      //   _id: "",
      //   count: Math.floor(Math.random() * 5000) + 1000,
      // },
      // {
      //   _id: "",
      //   count: Math.floor(Math.random() * 5000) + 1000,
      // },
      // {
      //   _id: "",
      //   count: Math.floor(Math.random() * 5000) + 1000,
      // },
    ];
    const newData = placeholderData.map((item) => ({
      _id: item._id,
      count: Math.floor(Math.random() * 5000) + 1000,
    }));
    setRandomData(newData);
  };

  useEffect(() => {
    generateRandomData();
    const interval = setInterval(() => {
      generateRandomData();
    }, 1000); // Change the interval as needed (e.g., 10 seconds)

    return () => clearInterval(interval);
  }, []);

  return data;
}

export default useRandomData;
