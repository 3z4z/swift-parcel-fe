import { LuClipboardList, LuLayoutGrid, LuUsers } from "react-icons/lu";
import { Link } from "react-router";
import useRole from "../../hooks/useRole";
import { useTranslation } from "react-i18next";

export default function DbSideNavbarComponent() {
  const { t } = useTranslation();
  const { role } = useRole();
  return (
    <>
      <label
        htmlFor="dashboard"
        aria-label="close sidebar"
        className="drawer-overlay"
      ></label>
      <div className="flex min-h-full flex-col items-start bg-base-300 is-drawer-close:w-14 is-drawer-open:w-64">
        <ul className="menu w-full grow">
          <li>
            <Link
              to={"/"}
              className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
              data-tip={t("nav.homepage")}
            >
              <LuLayoutGrid className="size-4 my-1.5" />
              <span className="is-drawer-close:hidden">
                {t("nav.homepage")}
              </span>
            </Link>
          </li>
          <li>
            <Link
              to={
                role === "admin"
                  ? "/all-orders"
                  : role === "agent"
                  ? "/assigned-orders"
                  : "/my-orders"
              }
              className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
              data-tip={t("nav.orders_list")}
            >
              <LuClipboardList className="size-4 my-1.5" />
              <span className="is-drawer-close:hidden whitespace-nowrap">
                {t("nav.orders_list")}
              </span>
            </Link>
          </li>
          {role === "admin" && (
            <li>
              <Link
                to={"/manage-users"}
                className="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                data-tip={t("nav.manage_users")}
              >
                <LuUsers className="size-4 my-1.5" />
                <span className="is-drawer-close:hidden whitespace-nowrap">
                  {t("nav.manage_users")}
                </span>
              </Link>
            </li>
          )}
        </ul>
      </div>
    </>
  );
}
