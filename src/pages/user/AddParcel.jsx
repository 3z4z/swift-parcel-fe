import { Suspense } from "react";
import DbPageTitle from "../../components/dashboard/PageTitle";
import AddParcelForm from "../../components/forms/AddParcelForm";
import CostCalculatorForm from "../../components/forms/CostCalculatorForm";
import PageLoader from "../../components/loaders/PageLoader/PageLoader";

const getLocations = fetch("/data/locations.json").then((res) => res.json());

export default function AddParcelPage() {
  return (
    <>
      <DbPageTitle title={"Add a parcel"} />
      <div className="bg-base-200 p-3 rounded-xl">
        <div className="grid grid-cols-3 gap-6 max-w-7xl mx-auto w-full">
          <div className="col-span-2">
            <Suspense fallback={<PageLoader />}>
              <AddParcelForm getLocations={getLocations} />
            </Suspense>
          </div>
          <div className="bg-primary rounded-2xl p-6 h-max">
            <div className="text-center text-xl text-white mb-5 mt-3 font-medium">
              Cost Calculator
            </div>
            <CostCalculatorForm />
          </div>
        </div>
      </div>
    </>
  );
}
