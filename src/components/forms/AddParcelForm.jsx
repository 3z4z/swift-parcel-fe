import { useForm, useWatch } from "react-hook-form";
import { useAuthStore } from "../../stores/useAuthStore";
import { useState } from "react";

export default function AddParcelForm() {
  const { user } = useAuthStore();
  const [qts, setQts] = useState(1);
  const {
    handleSubmit,
    register,
    setValue,
    formState: { errors },
    control,
  } = useForm({
    mode: "all",
  });
  const watchPaymentType = useWatch({ name: "paymentType", control });
  const handleAddParcel = async (data) => {
    const parcelInfo = {
      ...data,
      senderName: user?.displayName,
      senderEmail: user?.email,
      deliveryStatus: "pending",
      paymentStatus: data.paymentType === "cod" ? "cod" : "unpaid",
    };
    console.log(parcelInfo);
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
          <label className="label">Parcel Quantity</label>
          <div className="join w-full">
            <button
              disabled={qts <= 1}
              type="button"
              onClick={() => {
                setQts(qts - 1);
                setValue("parcelQts", qts - 1);
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
              {...register("parcelQts")}
            />
            <button
              disabled={qts >= 10}
              type="button"
              onClick={() => {
                setQts(qts + 1);
                setValue("parcelQts", qts + 1);
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
            type="text"
            className="input w-full disabled:bg-base-100"
            placeholder="Enter amount to collect"
            {...register("pickupAmount")}
          />
        </div>
      </div>
      <label className="label">Pickup Address</label>
      <textarea
        className="textarea w-full"
        placeholder="Enter your pickup address"
        {...register("pickupAddress")}
      ></textarea>
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
            {...register("recipientName")}
          />
        </div>
        <div className="flex-1">
          <label className="label">Recipient Contact No</label>
          <input
            type="text"
            placeholder="Type Recipient Contact Number"
            className="input w-full"
            {...register("recipientContact")}
          />
        </div>
      </div>
      <label className="label">Recipient Address</label>
      <textarea
        className="textarea w-full"
        placeholder="Enter recipient address"
        {...register("recipientAddress")}
      ></textarea>
      <button className="btn btn-primary w-max px-10 mt-2">Send Now</button>
    </form>
  );
}
