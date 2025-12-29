import { useQuery } from "@tanstack/react-query";
import DbPageTitle from "../../components/dashboard/PageTitle";
import { useAuthStore } from "../../stores/useAuthStore";
import useAxios from "../../hooks/useAxios";
import { IoCall } from "react-icons/io5";
import { Link } from "react-router";
import PageLoader from "../../components/loaders/PageLoader/PageLoader";
import EmptyTableCard from "../../components/EmptyTableCard";

export default function MyOrdersPage() {
  const { user } = useAuthStore();
  const axios = useAxios();
  const { data: myParcels, isLoading } = useQuery({
    queryKey: ["parcels", user?.email],
    queryFn: async () => {
      const res = await axios.get(`/parcels?email=${user?.email}`);
      return res.data;
    },
  });
  return (
    <>
      <DbPageTitle title={"My Orders"} />
      {isLoading ? (
        <PageLoader />
      ) : myParcels.length > 0 ? (
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-white shadow">
          <table className="table">
            <thead className="bg-base-200">
              <tr>
                <th>Sl No.</th>
                <th>Parcel Info</th>
                <th>Status</th>
                <th>Parcel Cost</th>
                <th>Pickup Amount</th>
                <th>Recipient Info</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7}>Loading...</td>
                </tr>
              ) : (
                myParcels.map((p, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td className="min-w-52 font-medium">
                      <p className="capitalize">
                        {p.productType} -
                        <span>
                          {" "}
                          {p.productQts} Items - {p.parcelWeight}Kg
                        </span>
                      </p>
                      <p className="text-neutral/70 text-xs">
                        TID: {p.trackingId}
                      </p>
                    </td>
                    <td>
                      <div className="flex gap-1 items-center capitalize">
                        <span
                          className={`badge badge-sm badge-soft font-medium h-auto py-px ${
                            p.parcelMovementStatus === "delivered"
                              ? "badge-success border-success/15"
                              : p.parcelMovementStatus === "cancelled" ||
                                p.parcelMovementStatus === "returned"
                              ? "badge-error border-error/15"
                              : p.parcelMovementStatus === "pending"
                              ? "badge-warning border-warning/15"
                              : "badge-info border-info/15"
                          }`}
                        >
                          {p.parcelMovementStatus.split("-").join(" ")}
                        </span>
                        <span
                          className={`badge badge-sm font-medium h-auto py-px ${
                            p.paymentStatus === "cod"
                              ? "badge-info uppercase"
                              : p.paymentStatus === "unpaid"
                              ? "badge-warning"
                              : "badge-success"
                          }`}
                        >
                          {p.paymentStatus}
                        </span>
                      </div>
                    </td>
                    <td className="font-semibold">{p.parcelCost} BDT</td>
                    <td>{p.pickupAmount ? p.pickupAmount + " BDT" : "N/A"}</td>
                    <td>
                      <p>{p.recipientName}</p>
                      <p className="flex items-center gap-1 text-primary font-medium">
                        <IoCall />
                        {p.recipientContact}
                      </p>
                    </td>
                    <td>
                      <Link
                        to={`/my-orders/${p._id}`}
                        className="btn btn-success btn-soft btn-sm border-success/25 py-1! px-4!"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyTableCard />
      )}
    </>
  );
}
