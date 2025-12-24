import { Link } from "react-router";
import { useAuthStore } from "../stores/useAuthStore";
import PrimarySpinnerLoader from "./loaders/PrimarySpinner";

export default function NavbarComponent() {
  const { user, isAuthLoading, logout } = useAuthStore();
  const handleLogout = async () => {
    await logout();
  };
  return (
    <nav className="flex gap-2">
      {isAuthLoading ? (
        <PrimarySpinnerLoader />
      ) : user ? (
        <div className="flex gap-5 items-center">
          <p>
            Welcome,{" "}
            <span className="font-semibold">
              {user?.displayName.split(" ")[0]}
            </span>
          </p>
          <button className="btn btn-error" onClick={handleLogout}>
            Log out
          </button>
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
