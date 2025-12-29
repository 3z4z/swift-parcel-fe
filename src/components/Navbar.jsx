import { Link } from "react-router";
import { useAuthStore } from "../stores/useAuthStore";
import PrimarySpinnerLoader from "./loaders/PrimarySpinner";
import useRole from "../hooks/useRole";
import { LuScanLine } from "react-icons/lu";
import { useRef } from "react";
import { ScanParcelComponent } from "./ScanParcel";
import { FaRegCircleUser } from "react-icons/fa6";
import { BiExit } from "react-icons/bi";
import { MdOutlineAddCircleOutline } from "react-icons/md";

export default function NavbarComponent() {
  const { user, isAuthLoading, logout } = useAuthStore();
  const { role } = useRole();
  const scanParcelModalRef = useRef();
  const handleScan = (trackingId) => {
    console.log("Scanned Parcel ID:", trackingId);
    scanParcelModalRef.current.close();
  };
  const handleLogout = async () => {
    await logout();
  };
  return (
    <nav>
      {isAuthLoading ? (
        <PrimarySpinnerLoader />
      ) : user ? (
        <>
          {role === "agent" && (
            <>
              <button
                className="md:hidden btn text-primary shadow-lg p-2! h-auto me-2"
                onClick={() => scanParcelModalRef.current.showModal()}
              >
                <LuScanLine className="size-4.5 text-primary" />
              </button>
            </>
          )}
          <div className="md:hidden dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="p-1 rounded-full btn h-auto shadow-lg"
            >
              <FaRegCircleUser className="size-5.5 text-primary" />
            </div>
            <ul
              tabIndex="-1"
              className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
            >
              {role === "user" && (
                <li>
                  <Link to={"/add-parcel"} className="text-primary">
                    <MdOutlineAddCircleOutline className="size-4" /> Send Parcel
                  </Link>
                </li>
              )}
              <li>
                <button className="text-error" onClick={handleLogout}>
                  <BiExit className="rotate-180 size-4" /> Log out
                </button>
              </li>
            </ul>
          </div>
          <div className="md:flex hidden gap-2 items-center">
            {role === "user" && (
              <Link to={"/add-parcel"} className="btn btn-primary">
                Send Parcel
              </Link>
            )}
            <button className="btn btn-secondary" onClick={handleLogout}>
              Log out
            </button>
            {role === "agent" && (
              <>
                <button
                  className="btn shadow text-primary"
                  onClick={() => scanParcelModalRef.current.showModal()}
                >
                  <LuScanLine className="size-5" />
                  <span>Scan</span>
                </button>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <div className="md:hidden dropdown dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="p-1 rounded-full btn h-auto shadow-lg"
            >
              <FaRegCircleUser className="size-5.5 text-primary" />
            </div>
            <ul
              tabIndex="-1"
              className="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm"
            >
              <li>
                <Link to={"auth/login"} className="text-primary font-semibold">
                  Login
                </Link>
              </li>
              <li>
                <Link
                  to={"auth/register"}
                  className="text-secondary font-semibold"
                >
                  Register
                </Link>
              </li>
            </ul>
          </div>
          <div className="max-md:hidden flex gap-2">
            <Link to={"auth/login"} className="btn btn-primary">
              Login
            </Link>
            <Link to={"auth/register"} className="btn btn-primary">
              Register
            </Link>
          </div>
        </>
      )}
      <ScanParcelComponent
        onScan={handleScan}
        scanParcelModalRef={scanParcelModalRef}
      />
    </nav>
  );
}
