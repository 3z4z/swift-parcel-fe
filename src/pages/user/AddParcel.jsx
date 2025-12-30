import { Suspense } from "react";
import DbPageTitle from "../../components/dashboard/PageTitle";
import AddParcelForm from "../../components/forms/AddParcelForm";
import CostCalculatorForm from "../../components/forms/CostCalculatorForm";
import PageLoader from "../../components/loaders/PageLoader/PageLoader";
import { IoMdClose } from "react-icons/io";
import { useTranslation } from "react-i18next";

const getLocations = fetch("/data/locations.json").then((res) => res.json());

export default function AddParcelPage() {
  const { t } = useTranslation();
  return (
    <>
      <div className="flex justify-between">
        <DbPageTitle title={t("add_parcel")} />
        <div className="drawer drawer-end lg:hidden w-max">
          <input id="calc-drawer" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            {/* Page content here */}
            <label
              htmlFor="calc-drawer"
              className="drawer-button btn btn-primary rounded-full"
            >
              {t("form.actions.calculator")}
            </label>
          </div>
          <div className="drawer-side">
            <label
              htmlFor="calc-drawer"
              aria-label="close sidebar"
              className="drawer-overlay"
            ></label>
            <div className="menu bg-base-200 min-h-full w-80 p-4">
              <label
                htmlFor="calc-drawer"
                aria-label="close sidebar"
                className="drawer-button btn w-max btn-primary btn-outline mb-3 p-2 rounded-full h-auto ms-auto"
              >
                <IoMdClose />
              </label>
              <div className="bg-primary rounded-2xl p-6 h-max">
                <div className="text-center text-xl text-white mb-5 mt-3 font-medium">
                  {t("form.titles.cost_calculator")}
                </div>
                <CostCalculatorForm />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="bg-base-200 p-3 rounded-xl">
        <div className="grid lg:grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
          <div className="lg:col-span-2">
            <Suspense fallback={<PageLoader />}>
              <AddParcelForm getLocations={getLocations} />
            </Suspense>
          </div>
          <div className="max-lg:hidden bg-primary rounded-2xl p-6 h-max">
            <div className="text-center text-xl text-white mb-5 mt-3 font-medium">
              {t("form.titles.cost_calculator")}
            </div>
            <CostCalculatorForm />
          </div>
        </div>
      </div>
    </>
  );
}
