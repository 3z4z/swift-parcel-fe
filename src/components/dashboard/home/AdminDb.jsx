import { useAuthStore } from "../../../stores/useAuthStore";
import { BarcodeScanner } from "../../ScanParcel";

export default function AdminDbHome() {
  const { user } = useAuthStore();
  return (
    <>
      <h1 className="text-xl">
        Good Morning Admin!{" "}
        <span className="font-semibold">{user?.displayName}</span>
      </h1>
    </>
  );
}
