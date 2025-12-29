import { useQuery } from "@tanstack/react-query";
import DbPageTitle from "../../components/dashboard/PageTitle";
import { useAuthStore } from "../../stores/useAuthStore";
import useAxios from "../../hooks/useAxios";
import PageLoader from "../../components/loaders/PageLoader/PageLoader";
import EmptyTableCard from "../../components/EmptyTableCard";
import { Link } from "react-router";
import Swal from "sweetalert2";
import { deliveryLocation } from "../../utils/getDeliveryLocation";
import useLocations from "../../hooks/useLocations";
import { useEffect } from "react";
import { useScanStore } from "../../stores/useScanStore";
// import { getGeoLocation } from "../../utils/geoLocation";

export default function AssignedOrdersPage() {
  const { scannedOrderTId, clearScan } = useScanStore();
  const locations = useLocations();
  const { user } = useAuthStore();
  const axios = useAxios();
  const {
    data: orders,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["assigned-orders", user],
    queryFn: async () => {
      const res = await axios.get(`/parcels?riderEmail=${user?.email}`);
      return res.data;
    },
  });
  const handleOrderUpdate = async (order, status, details, location) => {
    // To get dynamic locations, this call is needed.
    // const { lat, lng } = await getGeoLocation();
    const filteredStatus = status.split("-").join(" ");

    Swal.fire({
      title: `Mark as ${filteredStatus}?`,
      text: `This parcel will be marked as ${filteredStatus}!`,
      icon: "info",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Confirm",
    }).then(async (result) => {
      if (result.isConfirmed) {
        const updateOrder = {
          parcelMovementStatus: status,
          trackingId: order.trackingId,
          details,
          location: location || order.location,
        };
        await axios.patch(`/parcels/${order._id}`, updateOrder);
        refetch();
        Swal.fire({
          title: "Status updated!",
          text: `Parcel status changed to ${filteredStatus}.`,
          icon: "success",
        });
      }
    });
  };
  useEffect(() => {
    if (!scannedOrderTId) {
      return;
    }
    const order = orders.find((o) => o.trackingId === scannedOrderTId);
    if (!order) {
      return;
    }
    if (order.parcelMovementStatus === "assigned") {
      handleOrderUpdate(
        order,
        "picked",
        `Parcel has been picked from sender's pickup location.`
      );
    }
    if (order.parcelMovementStatus === "assigned-to-deliver") {
      handleOrderUpdate(
        order,
        "delivered",
        `Parcel has been delivered to the customer successfully.`,
        deliveryLocation(order.recipientDistrict, locations)
      );
    }
    clearScan();
  }, [handleOrderUpdate, locations, orders, scannedOrderTId, clearScan]);
  return (
    <>
      <DbPageTitle title={"Assigned orders to me"} />
      {isLoading ? (
        <PageLoader />
      ) : orders.length > 0 ? (
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-white shadow">
          <table className="table">
            <thead className="bg-base-200">
              <tr>
                <th>Sl no.</th>
                <th>Parcel Info</th>
                <th>Sender Info</th>
                <th>Pickup Info</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>

                  <td className="font-medium">
                    <p className="capitalize mb-1">
                      {o.productType} -
                      <span>
                        {" "}
                        {o.productQts} Items - {o.parcelWeight}Kg
                      </span>
                    </p>
                    <p className="text-neutral/70 text-xs">
                      TID: {o.trackingId}
                    </p>
                    <p className="text-neutral/70 text-xs">
                      Cost: {o.parcelCost} BDT
                    </p>
                    <p className="text-neutral/70 text-xs">
                      Collect amount: {o.pickupAmount ?? "N/A"} BDT
                    </p>
                  </td>
                  <td>
                    <p className="font-medium text-primary">{o.senderName}</p>
                    <small className="text-neutral/70">{o.senderEmail}</small>
                  </td>
                  <td>
                    <p className="font-medium">{o.pickupAddress}</p>
                    <small className="text-neutral/70">
                      {o.pickupDivision}
                      {" > "}
                      {o.pickupDivision}
                    </small>
                  </td>
                  <td>
                    <div className="flex gap-1">
                      {(() => {
                        let details =
                          "Parcel has been picked from pickup location.";
                        switch (o?.parcelMovementStatus) {
                          case "assigned":
                            details = `Parcel has been picked from sender's pickup location.`;
                            return (
                              <button
                                onClick={() =>
                                  handleOrderUpdate(o, "picked", details)
                                }
                                className="btn btn-sm py-1! px-4! btn-success btn-soft border-success/15"
                              >
                                Mark picked
                              </button>
                            );
                          case "picked":
                            details = `Parcel is now going to the central processing.`;
                            return (
                              <button
                                onClick={() =>
                                  handleOrderUpdate(o, "to-central", details)
                                }
                                className="btn btn-sm py-1! px-4! btn-success btn-soft border-success/15"
                              >
                                Mark to Central
                              </button>
                            );
                          case "assigned-to-deliver":
                            details = `Parcel has been delivered to the customer successfully.`;
                            return (
                              <button
                                onClick={() =>
                                  handleOrderUpdate(
                                    o,
                                    "delivered",
                                    details,
                                    deliveryLocation(
                                      o.recipientDistrict,
                                      locations
                                    )
                                  )
                                }
                                className="btn btn-sm py-1! px-4! btn-success btn-soft border-success/15"
                              >
                                Mark delivered
                              </button>
                            );
                        }
                      })()}
                      <Link
                        to={`/assigned-orders/${o._id}`}
                        className="btn btn-sm py-1! px-4! btn-info btn-soft border-success/15"
                      >
                        View
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <EmptyTableCard />
      )}
    </>
  );
}
