import { useQuery } from "@tanstack/react-query";
import useAxios from "../../hooks/useAxios";
import PageLoader from "../../components/loaders/PageLoader/PageLoader";
import DbPageTitle from "../../components/dashboard/PageTitle";
import EmptyTableCard from "../../components/EmptyTableCard";
import { IoCall } from "react-icons/io5";
import { Link } from "react-router";
import { useRef, useState } from "react";
import AssignRiderModal from "../../components/modals/AssignRiderModal";
import Swal from "sweetalert2";
import { deliveryLocation } from "../../utils/getDeliveryLocation";
import useLocations from "../../hooks/useLocations";
import { handleOrderUpdate } from "../../utils/handleOrderUpdate";
import { useTranslation } from "react-i18next";

export default function AllOrdersPage() {
  const { t } = useTranslation();
  const locations = useLocations();
  const [selectedParcel, setSelectedParcel] = useState({});
  const centralCity = locations.find((l) => l.city === "Dhaka");
  const centralLocation = {
    lat: centralCity?.latitude,
    lng: centralCity?.longitude,
  };
  const axios = useAxios();
  const {
    data: parcels,
    isLoading,
    refetch,
  } = useQuery({
    queryKey: ["parcels"],
    queryFn: async () => {
      const res = await axios.get("/parcels");
      return res.data;
    },
  });

  const assignRiderModalRef = useRef();
  const handleAssignRider = (parcel) => {
    assignRiderModalRef.current.showModal();
    setSelectedParcel(parcel);
    refetch();
  };
  const handleCancelOrder = (parcel) => {
    Swal.fire({
      title: "Are you sure?",
      text: "This parcel will be cancelled permanently!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Cancel Now",
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.patch(`/parcels/${parcel?._id}/cancel`, {
          senderEmail: parcel.senderEmail,
          trackingId: parcel.trackingId,
          location: parcel.location,
        });
        Swal.fire({
          title: "Cancelled!",
          text: "Order has been cancelled!",
          icon: "success",
        });
        refetch();
      }
    });
    console.log(parcel);
  };
  if (isLoading) return <PageLoader />;
  return (
    <>
      <DbPageTitle title={t("all_orders")} />
      {parcels.length > 0 ? (
        <div className="overflow-x-auto rounded-box border border-base-content/5 bg-white shadow">
          <table className="table">
            <thead className="bg-base-200">
              <tr>
                <th>{t("table.sl_no")}</th>
                <th>{t("table.sender_info")}</th>
                <th>{t("table.parcel_info")}</th>
                <th>{t("table.status")}</th>
                <th>{t("table.recipient_info")}</th>
                <th>{t("table.actions")}</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={7}>Loading...</td>
                </tr>
              ) : (
                parcels.map((p, i) => (
                  <tr key={i}>
                    <td>{i + 1}</td>
                    <td>
                      <p className="font-medium text-primary">{p.senderName}</p>
                      <small className="text-neutral/70">{p.senderEmail}</small>
                    </td>
                    <td className="font-medium min-w-52">
                      <p className="capitalize mb-1">
                        {p.productType} -
                        <span>
                          {" "}
                          {p.productQts} Items - {p.parcelWeight}Kg
                        </span>
                      </p>
                      <p className="text-neutral/70 text-xs">
                        TID: {p.trackingId}
                      </p>
                      <p className="text-neutral/70 text-xs">
                        Cost: {p.parcelCost} BDT
                      </p>
                      <p className="text-neutral/70 text-xs">
                        Collect amount: {p.pickupAmount ?? "N/A"} BDT
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
                    <td>
                      <p className="font-medium">{p.recipientName}</p>
                      <p className="flex items-center gap-1 text-primary">
                        <IoCall />
                        {p.recipientContact}
                      </p>
                    </td>
                    <td>
                      <div className="flex justify-end gap-1 *:py-1! *:px-4! *:btn *:btn-sm *:rounded-full *:btn-soft">
                        {p.parcelMovementStatus !== "cancelled" &&
                          (() => {
                            let details = "";
                            switch (p?.parcelMovementStatus) {
                              case "pending":
                                details = "Order has been accepted";
                                return (
                                  <button
                                    // onClick={() => handleParcelAccept(p)}
                                    onClick={() =>
                                      handleOrderUpdate(
                                        axios,
                                        refetch,
                                        p,
                                        "accepted",
                                        details,
                                        p.location
                                      )
                                    }
                                    className="btn-success border-success/25"
                                  >
                                    Accept
                                  </button>
                                );
                              case "accepted":
                                return (
                                  <button
                                    onClick={() => handleAssignRider(p)}
                                    className="btn-success border-success/25"
                                  >
                                    Assign Rider
                                  </button>
                                );
                              case "to-central":
                                details =
                                  "Parcel has been arrived at the central processing.";
                                return (
                                  <button
                                    onClick={() =>
                                      handleOrderUpdate(
                                        axios,
                                        refetch,
                                        p,
                                        "at-central",
                                        details,
                                        centralLocation
                                      )
                                    }
                                    className="btn-success border-success/25"
                                  >
                                    Mark at Central
                                  </button>
                                );
                              case "at-central":
                                details =
                                  "Parcel is going to the delivery hub.";
                                return (
                                  <button
                                    onClick={() =>
                                      handleOrderUpdate(
                                        axios,
                                        refetch,
                                        p,
                                        "to-delivery-hub",
                                        details,
                                        centralLocation
                                      )
                                    }
                                    className="btn-success border-success/25"
                                  >
                                    Mark to Delivery Hub
                                  </button>
                                );
                              case "to-delivery-hub":
                                details =
                                  "Parcel has been arrived at the delivery hub.";
                                return (
                                  <button
                                    onClick={() =>
                                      handleOrderUpdate(
                                        axios,
                                        refetch,
                                        p,
                                        "at-delivery-hub",
                                        details,
                                        deliveryLocation(
                                          p.recipientDistrict,
                                          locations
                                        )
                                      )
                                    }
                                    className="btn-success border-success/25"
                                  >
                                    Mark at Delivery Hub
                                  </button>
                                );
                              case "at-delivery-hub":
                                return (
                                  <button
                                    onClick={() => handleAssignRider(p)}
                                    className="btn-success border-success/25"
                                  >
                                    Mark to Delivery
                                  </button>
                                );
                            }
                          })()}
                        <Link
                          to={`/all-orders/${p._id}`}
                          className="btn-info border-info/25"
                        >
                          Details
                        </Link>
                        {p.parcelMovementStatus !== "delivered" &&
                          p.parcelMovementStatus !== "cancelled" && (
                            <button
                              onClick={() => handleCancelOrder(p)}
                              className="btn-error border-error/25"
                            >
                              Cancel
                            </button>
                          )}
                      </div>
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
      <AssignRiderModal
        locations={locations}
        refetch={refetch}
        assignRiderModalRef={assignRiderModalRef}
        selectedParcel={selectedParcel}
      />
    </>
  );
}
