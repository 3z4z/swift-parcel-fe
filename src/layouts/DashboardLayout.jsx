import { Outlet, useLocation } from "react-router";
import HeaderComponent from "../components/Header";
import {
  RiDashboardHorizontalLine,
  RiFileListLine,
  RiMenuFill,
} from "react-icons/ri";
import DbSideNavbarComponent from "../components/dashboard/SideNavbar";
import { useAuthStore } from "../stores/useAuthStore";

export default function DashboardLayout() {
  const { user } = useAuthStore();
  const { pathname } = useLocation();
  return (
    <div className="flex flex-col min-h-dvh w-full">
      <div className="drawer lg:drawer-open min-h-dvh">
        <input id="db-sidebar" type="checkbox" className="drawer-toggle" />
        <div className="drawer-content flex flex-col">
          <nav className="navbar w-full bg-base-300 border-b-2 border-b-primary/10 shadow-lg">
            {user && (
              <label
                htmlFor="db-sidebar"
                aria-label="open sidebar"
                className="btn btn-square btn-ghost"
              >
                <RiMenuFill className="size-5" />
              </label>
            )}
            <HeaderComponent />
          </nav>
          <div
            className={`${pathname.includes("auth") ? "flex-1 flex" : "p-3"}`}
          >
            <Outlet />
          </div>
        </div>
        <div className="drawer-side is-drawer-close:overflow-visible">
          {user && (
            <>
              <label
                htmlFor="my-drawer-4"
                aria-label="close sidebar"
                className="drawer-overlay"
              ></label>
              <DbSideNavbarComponent />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
