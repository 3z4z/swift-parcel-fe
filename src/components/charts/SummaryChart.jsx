import { useQuery } from "@tanstack/react-query";
import { Label, Pie, PieChart } from "recharts";
import useAxios from "../../hooks/useAxios";
import useAnalytics from "../../hooks/useAnalytics";
import PageLoader from "../loaders/PageLoader/PageLoader";
import { useTranslation } from "react-i18next";

export default function SummaryChartComponent() {
  const { t } = useTranslation();
  const { data: analytics = [], isLoading } = useAnalytics();
  const axios = useAxios();
  const { data: codAmount = [] } = useQuery({
    queryKey: ["cod-amount", "parcels"],
    queryFn: async () => {
      const res = await axios.get("/parcels/analytics/cod");
      return res.data;
    },
  });
  if (isLoading) return <PageLoader />;
  const chartKeys = ["pending", "assigned", "delivered", "cancelled"];
  const colors = {
    pending: "oklch(75% 0.22 90)",
    assigned: "oklch(70% 0.12 240)",
    delivered: "oklch(68% 0.18 150)",
    cancelled: "oklch(60% 0.25 25)",
  };
  const lookup = Object.fromEntries(analytics.map((i) => [i._id, i.count]));
  const data = chartKeys.map((k) => ({
    name: k,
    value: lookup[k] || 0,
    fill: colors[k],
  }));
  console.log("codAmount", codAmount[0]?.total);
  return (
    <PieChart
      responsive
      style={{
        height: "100%",
        width: "100%",
      }}
    >
      <Pie
        data={data}
        dataKey="value"
        nameKey="name"
        outerRadius="80%"
        innerRadius="60%"
        isAnimationActive={false}
      />
      <Label position="center" fill="#666" className="text-xl font-bold">
        {`COD: ৳${codAmount[0]?.total ?? "0"} ${t("bdt")}`}
      </Label>
    </PieChart>
  );
}
