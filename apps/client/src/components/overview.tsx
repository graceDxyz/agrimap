import useRandomData from "@/hooks/useRandomData";
import { memo } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts";
import { FarmerData } from "schema";

interface Props {
  data?: FarmerData[];
  isLoading?: boolean;
}

export function Overview(props: Props) {
  const randomData = useRandomData(props.isLoading);

  const data = props.isLoading ? randomData : props.data;

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="_id"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Bar
          dataKey="count"
          className={props.isLoading ? "fill-foreground" : ""}
          fill="#adfa1d"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}

export const MemoizedOverview = memo(Overview);
