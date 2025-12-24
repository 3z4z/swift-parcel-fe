import { useEffect } from "react";
import { useAuthStore } from "./stores/useAuthStore";

export default function AppInit() {
  const { initAuthListener } = useAuthStore();
  useEffect(() => {
    const unsubscribe = initAuthListener();
    return () => unsubscribe();
  }, [initAuthListener]);
  return null;
}
