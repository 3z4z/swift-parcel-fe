import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router";
import PageLoader from "../../components/loaders/PageLoader/PageLoader";
import useAxios from "../../hooks/useAxios";
import { IoCall } from "react-icons/io5";
import ParcelTrackingTimeline from "../../components/dashboard/parcelTracking/ParcelTrackingTimeline";

export default function ViewOrderPage() {
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
    <div className="grid grid-cols-5 bg-base-300 rounded-2xl p-5 gap-10">
      <div className="col-span-3">
        <div className="bg-base-100 border-primary/20 p-4 grid grid-cols-2 rounded-xl">
          <div>
            <div>
              <h3 className="text-xl font-bold text-secondary border-b-2 border-secondary/25 w-max pe-3 mb-4">
                Parcel Info
              </h3>
              <p>
                Tracking ID:
                <span className="text-primary font-semibold ms-1">
                  {parcel.trackingId}
                </span>
              </p>
              <p>
                Movement Status:
                <span className="capitalize text-primary font-semibold ms-1">
                  {parcel.parcelMovementStatus.split("-").join(" ")}
                </span>
              </p>
              <p>
                Product Type:
                <span className="capitalize text-primary font-semibold ms-1">
                  {parcel.productType}
                </span>
              </p>
              <p className="mt-6">
                Parcel Weight:
                <span className="capitalize text-primary font-semibold ms-1">
                  {parcel.parcelWeight} Kg
                </span>
              </p>
              <p>
                Product Quantity:
                <span className="capitalize text-primary font-semibold ms-1">
                  {parcel.productQts} items
                </span>
              </p>
              <p>
                Delivery Type:
                <span className="capitalize text-primary font-semibold ms-1">
                  {parcel.deliveryType.split("-").join(" ")}
                </span>
              </p>
              <div className="mt-6">
                Pickup Address: <br />
                <span className="text-neutral/80">{parcel.pickupAddress}</span>
              </div>
              <div className="mt-6">
                Pickup Location:
                <span className="text-neutral/80 ms-1">
                  {parcel.pickupDivision}
                  {" > "}
                  {parcel.pickupDistrict}
                </span>
              </div>
              {parcel.optionalInstructions && (
                <div className="mt-6">
                  Special Instructions: <br />
                  <span className="text-neutral/80">
                    {parcel.optionalInstructions}
                  </span>
                </div>
              )}
            </div>
          </div>
          <div>
            <div>
              <h3 className="text-xl font-bold text-secondary border-b-2 border-secondary/25 w-max pe-3 mb-4">
                Receiver Info
              </h3>
              <p className="font-bold text-primary">{parcel.recipientName}</p>
              <p className="text-sm flex items-center gap-1">
                <IoCall className="text-primary" />
                {parcel.recipientContact}
              </p>
              <p className="mt-6">
                Address: <br />
                <span className="text-neutral/80">
                  {parcel.recipientAddress}
                </span>
              </p>
              <p className="mt-6">
                Location:
                <span className="text-neutral/80 ms-1">
                  {parcel.recipientDistrict}
                  {" > "}
                  {parcel.recipientDivision}
                </span>
              </p>
            </div>
            <div className="mt-10">
              <h3 className="text-xl font-bold text-secondary border-b-2 border-secondary/25 w-max pe-3 mb-4">
                Payment Info
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
                    <button className="btn btn-primary btn-sm">Pay Now</button>
                  </>
                ) : (
                  <p className="badge badge-success badge-soft">
                    {parcel.paymentStatus}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-span-2">
        <ParcelTrackingTimeline parcel={parcel} />
      </div>
    </div>
  );
}
