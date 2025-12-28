import { Link } from "react-router";
import LogoComponent from "./Logo";
import NavbarComponent from "./Navbar";
import { socket } from "../socket";
import toast from "react-hot-toast";
import { QueryClient } from "@tanstack/react-query";

const queryClient = new QueryClient();
socket.on("parcel-update", (data) => {
  console.log(data);
  toast.success(`${data?.trackingId} ${data?.details}`);
  queryClient.invalidateQueries(["parcels"]);
});
socket.on("order-cancel", (data) => {
  console.log(data);
  toast.error(`${data?.trackingId} ${data?.details}`);
  queryClient.invalidateQueries(["parcels"]);
});
export default function HeaderComponent() {
  return (
    <header className="w-full p-3 flex justify-between items-center">
      <Link to={"/"}>
        <LogoComponent />
      </Link>
      <NavbarComponent />
    </header>
  );
}
