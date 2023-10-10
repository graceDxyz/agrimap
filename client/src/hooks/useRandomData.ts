import { useBoundStore } from "@/lib/store";
import { FarmerData } from "@/types/statistic.type";
import { useEffect, useState } from "react";

function useRandomData() {
  const [data, setRandomData] = useState<FarmerData[]>([]);
  const { activeSwitcher } = useBoundStore((state) => state.overview);

  const length = activeSwitcher.label === "Weekly" ? 7 : 12;

  const generateRandomData = () => {
    const newData = Array.from({ length }, () => ({
      _id: "",
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
