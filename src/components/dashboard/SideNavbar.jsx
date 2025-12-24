import { LuClipboardList, LuLayoutGrid, LuUsers } from "react-icons/lu";

export default function DbSideNavbarComponent() {
  return (
    <div className="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-64">
      <ul className="menu w-full grow">
        <li>
          <button
            className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
            data-tip="Homepage"
          >
            <LuLayoutGrid className="size-4 my-1.5" />
            <span className="is-drawer-close:hidden">Homepage</span>
          </button>
        </li>
        <li>
          <button
            className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
            data-tip="Orders List"
          >
            <LuClipboardList className="size-4 my-1.5" />
            <span className="is-drawer-close:hidden whitespace-nowrap">
              Orders List
            </span>
          </button>
        </li>
        <li>
          <button
            className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
            data-tip="Manage Users"
          >
            <LuUsers className="size-4 my-1.5" />
            <span className="is-drawer-close:hidden whitespace-nowrap">
              Manage Users
            </span>
          </button>
        </li>
      </ul>
    </div>
  );
}
