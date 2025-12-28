import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../stores/useAuthStore.js";
import useAxios from "./useAxios.js";

export default function useUserStatus() {
  const { user } = useAuthStore();
  const axios = useAxios();
  const { isLoading: isStatusLoading, data: status } = useQuery({
    queryKey: ["user-status", user?.email],
    queryFn: async () => {
      const res = await axios.get(
        `${import.meta.env.VITE_API_BASE_URL}/users/${user?.email}/status`
      );
      return res.data;
    },
  });
  return { isStatusLoading, status };
}
