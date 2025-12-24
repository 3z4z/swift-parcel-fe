import { LuClipboardList, LuLayoutGrid, LuUsers } from "react-icons/lu";
import { Link } from "react-router";
import useRole from "../../hooks/useRole";

export default function DbSideNavbarComponent() {
  const { role } = useRole();
  return (
    <div className="flex min-h-full flex-col items-start bg-base-300 is-drawer-close:w-14 is-drawer-open:w-64">
      <ul className="menu w-full grow">
        <li>
          <Link
            to={"/"}
            className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
            data-tip="Homepage"
          >
            <LuLayoutGrid className="size-4 my-1.5" />
            <span className="is-drawer-close:hidden">Homepage</span>
          </Link>
        </li>
        <li>
          <Link
            to={role === "admin" ? "/all-orders" : "/my-orders"}
            className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
            data-tip="Orders List"
          >
            <LuClipboardList className="size-4 my-1.5" />
            <span className="is-drawer-close:hidden whitespace-nowrap">
              Orders List
            </span>
          </Link>
        </li>
        <li>
          <Link
            to={"/manage-users"}
            className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
            data-tip="Manage Users"
          >
            <LuUsers className="size-4 my-1.5" />
            <span className="is-drawer-close:hidden whitespace-nowrap">
              Manage Users
            </span>
          </Link>
        </li>
      </ul>
    </div>
  );
}
