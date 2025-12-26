import { useForm, useWatch } from "react-hook-form";
import { useAuthStore } from "../../stores/useAuthStore";
import { use, useState } from "react";
import useAxios from "../../hooks/useAxios";
import Swal from "sweetalert2";
import AuthSpinnerLoader from "../loaders/AuthSpinner";
// import { getGeoLocation } from "../../utils/geoLocation";

export default function AddParcelForm({ getLocations }) {
  const locations = use(getLocations);
  const divisions = [...new Set(locations.map((l) => l.region))];
  const { user } = useAuthStore();
  const [qts, setQts] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const axios = useAxios();
  const pickupLocation = (pickupDistrict) => {
    const result = locations?.find((l) => l?.district === pickupDistrict);
    return { lat: result?.latitude, lng: result?.longitude };
  };
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
    control,
    reset,
  } = useForm({
    mode: "all",
  });
  const watchPaymentType = useWatch({ name: "paymentType", control });
  const watchPickupDivision = useWatch({ name: "pickupDivision", control });
  const watchRecipientDivision = useWatch({
    name: "recipientDivision",
    control,
  });
  const getDistrictsByDivision = (dis) => {
    return [
      ...new Set(
        locations.filter((l) => l.region === dis).map((d) => d.district)
      ),
    ];
  };
  const handleAddParcel = async (data) => {
    setIsLoading(true);
    try {
      // To get dynamic locations, this call is needed.
      // const { lat, lng } = await getGeoLocation();
      const parcelInfo = {
        ...data,
        senderName: user?.displayName,
        senderEmail: user?.email,
        parcelMovementStatus: "pending",
        location: pickupLocation(data.pickupDistrict),
        paymentStatus: data.paymentType === "cod" ? "cod" : "unpaid",
      };
      const costRes = await axios.post("/parcels/cost-calculation", parcelInfo);
      Swal.fire({
        title: "Confirm Booking?",
        text: `Your Total cost for parcel is ${costRes.data}BDT`,
        icon: "info",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Confirm",
      }).then(async (result) => {
        if (result.isConfirmed) {
          await axios.post("/parcels", parcelInfo);
          Swal.fire({
            title: "Booked!",
            text: "Your Parcel is booked successfully!.",
            icon: "success",
          });
          reset();
        }
      });
    } catch (err) {
      console.log(err);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form onSubmit={handleSubmit(handleAddParcel)} className="fieldset">
      <div className="flex mb-2 gap-8">
        <div className="flex-1">
          <label className="label">Product Type</label>
          <select className="select w-full" {...register("productType")}>
            <option value="parcel">Parcel</option>
            <option value="fragile">Fragile</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="label">Delivery Type</label>
          <select className="select w-full" {...register("deliveryType")}>
            <option value="normal-delivery">Normal Delivery</option>
            <option value="urgent-delivery">Urgent Delivery (Same Day)</option>
            <option value="hub-delivery">Hub Delivery</option>
          </select>
        </div>
      </div>
      <div className="flex mb-2 gap-8">
        <div className="flex-1">
          <label className="label">Parcel Weight</label>
          <input
            type="number"
            placeholder="Type parcel weight in Kg"
            className="input w-full"
            {...register("parcelWeight", {
              valueAsNumber: true,
              required: "Parcel weight is required",
              validate: (value) =>
                Number.isInteger(value) || "Fractional not allowed",
              min: {
                value: 1,
                message:
                  "Below 1Kg not allowed. Any weight below 1Kg considered 1",
              },
              max: {
                value: 10,
                message: "Weight must not exceed 10Kg",
              },
            })}
          />
          {errors.parcelWeight && (
            <p className="text-error">{errors.parcelWeight.message}</p>
          )}
        </div>
        <div className="flex-1">
          <label className="label">Product Quantity</label>
          <div className="join w-full">
            <button
              disabled={qts <= 1}
              type="button"
              onClick={() => {
                setQts(qts - 1);
                setValue("productQts", qts - 1);
              }}
              className="btn rounded-r-none! bg-base-100 border-base-content/20"
            >
              -
            </button>
            <input
              readOnly
              type="number"
              defaultValue={"1"}
              className="input rounded-none! border-l-0 border-r-0"
              {...register("productQts")}
            />
            <button
              disabled={qts >= 10}
              type="button"
              onClick={() => {
                setQts(qts + 1);
                setValue("productQts", qts + 1);
              }}
              className="btn rounded-l-none! bg-base-100 border-base-content/20"
            >
              +
            </button>
          </div>
        </div>
      </div>
      <div className="flex mb-2 gap-8">
        <div className="flex-1">
          <label className="label">Payment Type</label>
          <select className="select w-full" {...register("paymentType")}>
            <option value="cod">Cash On Delivery</option>
            <option value="prepaid">Pre-paid</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="label">Type Amount to collect</label>
          <input
            disabled={watchPaymentType === "prepaid"}
            type="number"
            className="input w-full disabled:bg-base-100"
            placeholder="Enter amount to collect"
            {...register("pickupAmount", {
              valueAsNumber: true,
              required:
                watchPaymentType === "cod"
                  ? "Pickup amount is required"
                  : false,
            })}
          />
          {errors.pickupAmount && (
            <p className="text-error">{errors.pickupAmount.message}</p>
          )}
        </div>
      </div>
      <div className="flex gap-4 mb-2">
        <div className="flex-1">
          <label className="label">Pickup Division</label>
          <select
            className="select w-full"
            {...register("pickupDivision", {
              required: "Pickup division is required",
            })}
          >
            <option value="">Select pickup division</option>
            {divisions.map((d, i) => (
              <option key={i} value={d}>
                {d}
              </option>
            ))}
          </select>
          {errors.pickupDivision && (
            <p className="text-error">{errors.pickupDivision.message}</p>
          )}
        </div>
        <div className="flex-1">
          <label className="label">Pickup District</label>
          <select
            className="select w-full"
            {...register("pickupDistrict", {
              required: "Pickup district is required",
            })}
          >
            <option value="">Select pickup district</option>
            {getDistrictsByDivision(watchPickupDivision).map((d, i) => (
              <option key={i} value={d}>
                {d}
              </option>
            ))}
          </select>
          {errors.pickupDistrict && (
            <p className="text-error">{errors.pickupDistrict.message}</p>
          )}
        </div>
      </div>
      <label className="label">Pickup Address</label>
      <textarea
        className="textarea w-full"
        placeholder="Enter your full pickup address"
        {...register("pickupAddress", {
          required: "Full pickup address is required",
        })}
      ></textarea>
      {errors.pickupAddress && (
        <p className="text-error">{errors.pickupAddress.message}</p>
      )}
      <label className="label mt-2">Special Instructions</label>
      <textarea
        className="textarea w-full"
        placeholder="Enter special instructions (optional)"
        {...register("optionalInstructions")}
      ></textarea>
      <div className="flex mt-4 mb-2 gap-8">
        <div className="flex-1">
          <label className="label">Recipient Name</label>
          <input
            type="text"
            placeholder="Type Recipient Name"
            className="input w-full"
            {...register("recipientName", {
              required: "Recipient name is required",
            })}
          />
          {errors.recipientName && (
            <p className="text-error">{errors.recipientName.message}</p>
          )}
        </div>
        <div className="flex-1">
          <label className="label">Recipient Contact No</label>
          <input
            type="text"
            placeholder="Type Recipient Contact Number"
            className="input w-full"
            {...register("recipientContact", {
              required: "Recipient contact number is required",
            })}
          />
          {errors.recipientContact && (
            <p className="text-error">{errors.recipientContact.message}</p>
          )}
        </div>
      </div>

      <div className="flex gap-4 mb-2">
        <div className="flex-1">
          <label className="label">Recipient Division</label>
          <select
            className="select w-full"
            {...register("recipientDivision", {
              required: "Delivery division is required",
            })}
          >
            <option value="">Select recipient division</option>
            {divisions.map((d, i) => (
              <option key={i} value={d}>
                {d}
              </option>
            ))}
          </select>
          {errors.recipientDivision && (
            <p className="text-error">{errors.recipientDivision.message}</p>
          )}
        </div>
        <div className="flex-1">
          <label className="label">Recipient District</label>
          <select
            className="select w-full"
            {...register("recipientDistrict", {
              required: "Delivery district is required",
            })}
          >
            <option value="">Select recipient district</option>
            {getDistrictsByDivision(watchRecipientDivision).map((d, i) => (
              <option key={i} value={d}>
                {d}
              </option>
            ))}
          </select>
          {errors.recipientDistrict && (
            <p className="text-error">{errors.recipientDistrict.message}</p>
          )}
        </div>
      </div>
      <label className="label">Recipient Address</label>
      <textarea
        className="textarea w-full"
        placeholder="Enter recipient address"
        {...register("recipientAddress", {
          required: "Full delivery address is required",
        })}
      ></textarea>
      {errors.recipientAddress && (
        <p className="text-error">{errors.recipientAddress.message}</p>
      )}
      <button disabled={isLoading} className="btn btn-primary w-max px-10 mt-2">
        {isLoading && <AuthSpinnerLoader />}
        {isLoading ? "Sending" : "Send Now"}
      </button>
    </form>
  );
}
