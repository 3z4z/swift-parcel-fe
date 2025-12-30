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
import { useLanguage } from "../contexts/LanguageContext";
import { useTranslation } from "react-i18next";

export default function NavbarComponent() {
  const { changeLanguage } = useLanguage();
  const { t } = useTranslation();
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
    <div className="flex gap-1 items-center">
      <nav className="md:me-5">
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
                      <MdOutlineAddCircleOutline className="size-4" />
                      {t("nav.send_parcel")}
                    </Link>
                  </li>
                )}
                <li>
                  <button className="text-error" onClick={handleLogout}>
                    <BiExit className="rotate-180 size-4" /> {t("auth.logout")}
                  </button>
                </li>
              </ul>
            </div>
            <div className="md:flex hidden gap-2 items-center">
              {role === "user" && (
                <Link to={"/add-parcel"} className="btn btn-primary">
                  {t("nav.send_parcel")}
                </Link>
              )}
              <button className="btn btn-secondary" onClick={handleLogout}>
                {t("auth.logout")}
              </button>
              {role === "agent" && (
                <>
                  <button
                    className="btn shadow text-primary"
                    onClick={() => scanParcelModalRef.current.showModal()}
                  >
                    <LuScanLine className="size-5" />
                    <span>{t("nav.scan")}</span>
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
                  <Link
                    to={"auth/login"}
                    className="text-primary font-semibold"
                  >
                    {t("auth.login")}
                  </Link>
                </li>
                <li>
                  <Link
                    to={"auth/register"}
                    className="text-secondary font-semibold"
                  >
                    {t("auth.register")}
                  </Link>
                </li>
              </ul>
            </div>
            <div className="max-md:hidden flex gap-2">
              <Link to={"auth/login"} className="btn btn-primary">
                {t("auth.login")}
              </Link>
              <Link to={"auth/register"} className="btn btn-primary">
                {t("auth.register")}
              </Link>
            </div>
          </>
        )}
        <ScanParcelComponent
          onScan={handleScan}
          scanParcelModalRef={scanParcelModalRef}
        />
      </nav>
      <select
        onChange={(e) => changeLanguage(e.target.value)}
        className="select w-20 bg-base-300 border-none"
      >
        <option value="en">En</option>
        <option value="bn">Bn</option>
      </select>
    </div>
  );
}
