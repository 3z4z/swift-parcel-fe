import { useQuery } from "@tanstack/react-query";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import useAxios from "../../hooks/useAxios";
import PageLoader from "../loaders/PageLoader/PageLoader";

export default function DailyBookingChart() {
  const axios = useAxios();
  const { data: analytics = [], isLoading } = useQuery({
    queryKey: ["analytics"],
    queryFn: async () => {
      const res = await axios.get("/parcels/analytics/daily-orders");
      return res.data;
    },
  });
  if (isLoading) return <PageLoader />;
  return (
    <LineChart
      style={{
        padding: "1.5rem",
        width: "100%",
        height: "100%",
        maxHeight: "45vh",
        aspectRatio: "1/2",
      }}
      data={analytics}
      margin={{ top: 40, bottom: 10 }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="date" />
      <YAxis />
      <Tooltip />
      <Legend
        formatter={(value) => {
          if (value === "count") return "Daily Orders";
          return value;
        }}
      />
      <Line
        type="monotone"
        dataKey="count"
        stroke="#8884d8"
        strokeWidth={3}
        activeDot={{ r: 6 }}
      />
    </LineChart>
  );
}
