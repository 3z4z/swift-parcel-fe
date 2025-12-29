import { Link } from "react-router";
import LogoComponent from "./Logo";
import NavbarComponent from "./Navbar";
import { socket } from "../socket";
import toast from "react-hot-toast";
import { QueryClient, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useAuthStore } from "../stores/useAuthStore";

// const queryClient = new QueryClient();
// socket.on("parcel-update", (data) => {
//   console.log(data);
//   toast.success(`${data?.trackingId} ${data?.details}`);
//   queryClient.invalidateQueries(["parcels", "assigned-orders", "parcel"]);
// });
// socket.on("order-cancel", (data) => {
//   console.log(data);
//   toast.error(`${data?.trackingId} ${data?.details}`);
//   queryClient.invalidateQueries(["parcels"]);
// });
export default function HeaderComponent() {
  const { user, isUserReady } = useAuthStore();
  const queryClient = useQueryClient();
  useEffect(() => {
    if (!isUserReady) return null;
    if (user?.email) {
      socket.emit("join-room", user?.email);
      const handleParcelUpdate = (data) => {
        console.log("Parcel Update:", data);
        toast.success(`${data?.trackingId} ${data?.details}`);
        queryClient.invalidateQueries(["parcels", "assigned-orders", "parcel"]);
      };
      const handleOrderCancel = (data) => {
        console.log("Parcel Update:", data);
        toast.error(`${data?.trackingId} ${data?.details}`);
        queryClient.invalidateQueries(["parcels", "assigned-orders", "parcel"]);
      };
      socket.on("parcel-update", handleParcelUpdate);
      socket.on("order-cancel", handleOrderCancel);
      return () => {
        socket.off("parcel-update", handleParcelUpdate);
        socket.off("order-cancel", handleOrderCancel);
      };
    }
  }, [user, queryClient, isUserReady]);
  return (
    <header className="w-full p-3 flex justify-between items-center">
      <Link to={"/"}>
        <LogoComponent />
      </Link>
      <NavbarComponent />
    </header>
  );
}
