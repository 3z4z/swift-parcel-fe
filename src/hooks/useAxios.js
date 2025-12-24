import { useNavigate } from "react-router";
import { useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";
import { axiosInstance } from "../utils/axiosInstance";

export default function useAxios() {
  const { user, signOut } = useAuthStore();
  const navigate = useNavigate();
  useEffect(() => {
    const requestInterceptor = axiosInstance.interceptors.request.use(
      (config) => {
        config.withCredentials = true;
        return config;
      }
    );
    const responseInterceptor = axiosInstance.interceptors.response.use(
      (res) => res,
      (err) => {
        const status = err?.response?.status;
        if (status === 401 || status === 403) {
          //   signOut();
          //   navigate("/auth/login");
          console.log("error");
        }
        return Promise.reject(err);
      }
    );
    return () => {
      axiosInstance.interceptors.request.eject(requestInterceptor);
      axiosInstance.interceptors.response.eject(responseInterceptor);
    };
  }, [navigate, signOut, user]);
  return axiosInstance;
}
