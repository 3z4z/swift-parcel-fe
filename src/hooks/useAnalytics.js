import { useQuery } from "@tanstack/react-query";
import useAxios from "./useAxios";

export default function useAnalytics() {
  const axios = useAxios();
  return useQuery({
    queryKey: ["counts", "parcels"],
    queryFn: async () => {
      const res = await axios.get("/parcels/analytics");
      return res.data;
    },
  });
}
