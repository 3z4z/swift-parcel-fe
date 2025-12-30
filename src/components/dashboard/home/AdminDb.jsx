import { useAuthStore } from "../../../stores/useAuthStore";
import {
  LuClipboardList,
  LuHourglass,
  LuPackageCheck,
  LuTriangleAlert,
} from "react-icons/lu";
import PageLoader from "../../loaders/PageLoader/PageLoader";
import SummaryChartComponent from "../../charts/SummaryChart";
import useAnalytics from "../../../hooks/useAnalytics";
import { useTranslation } from "react-i18next";
import DailyBookingChart from "../../charts/DailyBookingChart";

export default function AdminDbHome() {
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { data: counts = [], isLoading } = useAnalytics();
  if (isLoading) return <PageLoader />;
  const stats = Object.fromEntries(counts.map((i) => [i._id, i.count]));
  return (
    <>
      <h1 className="text-xl">
        {t("title")} {t("admin")}!{" "}
        <span className="font-semibold">{user?.displayName}</span>
      </h1>
      <div className="grid lg:grid-cols-4 sm:grid-cols-2 gap-6 py-4">
        <div className="bg-base-200 p-5 rounded-xl shadow flex items-center justify-between">
          <div>
            <LuHourglass className="size-10 p-2 rounded-lg bg-warning/9 text-warning" />
            <p className="text-lg font-bold text-neutral mt-3">
              {t("status.pending")}
            </p>
          </div>
          <p className="text-3xl font-bold text-primary">
            {stats.pending ?? "0"}
          </p>
        </div>
        <div className="bg-base-200 p-5 rounded-xl shadow flex items-center justify-between">
          <div>
            <LuClipboardList className="size-10 p-2 rounded-lg bg-info/10 text-info" />
            <p className="text-lg font-bold text-neutral mt-3">
              {t("status.assigned")}
            </p>
          </div>
          <p className="text-3xl font-bold text-primary">
            {stats.assigned ?? "0"}
          </p>
        </div>
        <div className="bg-base-200 p-5 rounded-xl shadow flex items-center justify-between">
          <div>
            <LuPackageCheck className="size-10 p-2 rounded-lg bg-success/8 text-success" />
            <p className="text-lg font-bold text-neutral mt-3">
              {t("status.delivered")}
            </p>
          </div>
          <p className="text-3xl font-bold text-primary">
            {stats.delivered ?? "0"}
          </p>
        </div>
        <div className="bg-base-200 p-5 rounded-xl shadow flex items-center justify-between">
          <div>
            <LuTriangleAlert className="size-10 p-2 rounded-lg bg-error/7 text-error" />
            <p className="text-lg font-bold text-neutral mt-3">
              {t("status.cancelled")}
            </p>
          </div>
          <p className="text-3xl font-bold text-primary">
            {stats.cancelled ?? "0"}
          </p>
        </div>
      </div>
      <div className="grid 2xl:grid-cols-4 xl:grid-cols-3 md:grid-cols-2 gap-6 py-4">
        <div className="bg-base-200 rounded-3xl shadow">
          <SummaryChartComponent />
        </div>
        <div className="2xl:col-span-3 xl:col-span-2">
          <div className="bg-base-200 rounded-3xl shadow">
            <DailyBookingChart />
          </div>
        </div>
      </div>
    </>
  );
}
