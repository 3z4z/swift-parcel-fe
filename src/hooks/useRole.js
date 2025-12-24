import { useQuery } from "@tanstack/react-query";
import { useAuthStore } from "../stores/useAuthStore";
import useAxios from "./useAxios.js";

export default function useRole() {
  const { user } = useAuthStore();
  console.log("user", user.email);
  const axios = useAxios();
  const { isLoading: isRoleLoading, data: role = "user" } = useQuery({
    queryKey: ["user-role", user?.email],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:3000/users/${user?.email}/role`
      );
      return res.data;
    },
  });
  return { isRoleLoading, role };
}
