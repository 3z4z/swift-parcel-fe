import { Link } from "react-router";
import { useAuthStore } from "../stores/useAuthStore";
import PrimarySpinnerLoader from "./loaders/PrimarySpinner";
import useRole from "../hooks/useRole";
import { LuScanLine } from "react-icons/lu";

export default function NavbarComponent() {
  const { user, isAuthLoading, logout } = useAuthStore();
  const { role } = useRole();
  const handleLogout = async () => {
    await logout();
  };
  return (
    <nav className="flex gap-2">
      {isAuthLoading ? (
        <PrimarySpinnerLoader />
      ) : user ? (
        <div className="flex gap-2 items-center">
          {role === "user" && (
            <Link to={"/add-parcel"} className="btn btn-primary">
              Send Parcel
            </Link>
          )}
          <button className="btn btn-secondary" onClick={handleLogout}>
            Log out
          </button>
          {role === "agent" && (
            <button className="btn shadow text-primary">
              <LuScanLine className="size-5" />
              <span>Scan</span>
            </button>
          )}
        </div>
      ) : (
        <>
          <Link to={"auth/login"} className="btn btn-primary">
            Login
          </Link>
          <Link to={"auth/register"} className="btn btn-primary">
            Register
          </Link>
        </>
      )}
    </nav>
  );
}
