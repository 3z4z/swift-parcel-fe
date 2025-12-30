import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import PageLoader from "../../components/loaders/PageLoader/PageLoader";
import useAxios from "../../hooks/useAxios";
import { IoCall } from "react-icons/io5";
import ParcelTrackingTimeline from "../../components/dashboard/parcelTracking/ParcelTrackingTimeline";
import ParcelQRCode from "../../components/ParcelQrCode";
import { useTranslation } from "react-i18next";

export default function ViewOrderPage() {
  const { t } = useTranslation();
  const { id } = useParams();
  const axios = useAxios();
  const { data: parcel = {}, isLoading } = useQuery({
    queryKey: ["parcel", id],
    enabled: !!id,
    queryFn: async () => {
      const res = await axios.get(`/parcels/${id}`);
      return res.data;
    },
  });
  if (isLoading) return <PageLoader />;
  return (
    <div className="grid 2xl:grid-cols-5 xl:grid-cols-6 bg-base-300 rounded-2xl p-5 gap-10">
      <div className="xl:col-span-3 max-xl:order-2">
        <div className="bg-base-100 border-primary/20 p-4 grid md:grid-cols-2 rounded-xl">
          <div>
            <div>
              <h3 className="text-xl font-bold text-secondary border-b-2 border-secondary/25 w-max pe-3 mb-4">
                {t("parcel.parcel_info")}
              </h3>
              <p>
                Tracking ID:
                <span className="text-primary font-semibold ms-1">
                  {parcel.trackingId}
                </span>
              </p>
              <p>
                {t("parcel.movement_status")}:
                <span className="capitalize text-primary font-semibold ms-1">
                  {parcel.parcelMovementStatus.split("-").join(" ")}
                </span>
              </p>
              <p>
                {t("parcel.product_type")}:
                <span className="capitalize text-primary font-semibold ms-1">
                  {parcel.productType}
                </span>
              </p>
              <p className="mt-6">
                {t("parcel.parcel_weight")}:
                <span className="capitalize text-primary font-semibold ms-1">
                  {parcel.parcelWeight} Kg
                </span>
              </p>
              <p>
                {t("parcel.parcel_weight")}:
                <span className="capitalize text-primary font-semibold ms-1">
                  {parcel.productQts} items
                </span>
              </p>
              <p>
                {t("parcel.delivery_type")}:
                <span className="capitalize text-primary font-semibold ms-1">
                  {parcel.deliveryType.split("-").join(" ")}
                </span>
              </p>
              <div className="mt-6">
                {t("parcel.pickup_address")}: <br />
                <span className="text-neutral/80">{parcel.pickupAddress}</span>
              </div>
              <div className="mt-6">
                {t("parcel.pickup_location")}:
                <span className="text-neutral/80 ms-1">
                  {parcel.pickupDivision}
                  {" > "}
                  {parcel.pickupDistrict}
                </span>
              </div>
              {parcel.optionalInstructions && (
                <div className="mt-6">
                  {t("parcel.instruction")}: <br />
                  <span className="text-neutral/80">
                    {parcel.optionalInstructions}
                  </span>
                </div>
              )}
            </div>
            <div className="mt-5">
              <h3 className="text-xl font-bold text-secondary border-b-2 border-secondary/25 w-max pe-3 mb-4">
                {t("parcel.payment_info")}
              </h3>
              <div className="flex items-center gap-2">
                <p className="font-semibold text-primary">
                  ৳{parcel.parcelCost} BDT
                </p>
              </div>
              <div className="capitalize mt-3 flex gap-2 items-center">
                {parcel.paymentStatus === "cod" ? (
                  <p className="badge badge-primary badge-soft">
                    cash on delivery
                  </p>
                ) : parcel.paymentStatus === "unpaid" ? (
                  <>
                    <p className="badge badge-warning badge-soft">
                      {parcel.paymentStatus}
                    </p>
                    <button className="btn btn-primary btn-sm">
                      {t("parcel.pay_now")}
                    </button>
                  </>
                ) : (
                  <p className="badge badge-success badge-soft">
                    {parcel.paymentStatus}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="max-md:mt-5">
            <div className="mb-5">
              <h3 className="text-xl font-bold text-secondary border-b-2 border-secondary/25 w-max pe-3 mb-4">
                {t("parcel.receiver_info")}
              </h3>
              <p className="font-bold text-primary">{parcel.recipientName}</p>
              <p className="text-sm flex items-center gap-1">
                <IoCall className="text-primary" />
                {parcel.recipientContact}
              </p>
              <p className="mt-6">
                {t("parcel.address")}: <br />
                <span className="text-neutral/80">
                  {parcel.recipientAddress}
                </span>
              </p>
              <p className="mt-6">
                {t("parcel.location")}:
                <span className="text-neutral/80 ms-1">
                  {parcel.recipientDistrict}
                  {" > "}
                  {parcel.recipientDivision}
                </span>
              </p>
            </div>
            <div className="mt-5">
              <h3 className="text-xl font-bold text-secondary border-b-2 border-secondary/25 w-max pe-3 mb-4">
                {t("parcel.scan")}
              </h3>
              <ParcelQRCode trackingId={parcel?.trackingId} />
            </div>
          </div>
        </div>
      </div>
      <div className="2xl:col-span-2 xl:col-span-3">
        <ParcelTrackingTimeline parcel={parcel} />
      </div>
    </div>
  );
}
