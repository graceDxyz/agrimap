import { useBoundStore } from "@/lib/store";
import { useEffect, useState } from "react";
import { FarmerData, StatsBy } from "schema";

function useRandomData(isLoading?: boolean) {
  const [data, setRandomData] = useState<FarmerData[]>([]);
  const { activeSwitcher } = useBoundStore((state) => state.overview);

  const labelToLength: { [key: string]: number } = {
    [StatsBy.Weekly]: 7,
    [StatsBy.Monthly]: 12,
    [StatsBy.Annually]: 5,
  };

  const length = labelToLength[activeSwitcher.label] || 5;

  const generateRandomData = () => {
    const newData = Array.from({ length }, () => ({
      _id: "",
      count: Math.floor(Math.random() * 5000) + 1000,
    }));
    setRandomData(newData);
  };

  useEffect(() => {
    if (!isLoading) {
      return; // Don't start generating data if not in loading state
    }

    generateRandomData();
    const interval = setInterval(() => {
      generateRandomData();
    }, 1000); // Change the interval as needed (e.g., 10 seconds)

    return () => clearInterval(interval);
  }, [isLoading]);

  return data;
}

export default useRandomData;
