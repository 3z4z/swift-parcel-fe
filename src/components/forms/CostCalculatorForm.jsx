import { useState } from "react";
import { useForm } from "react-hook-form";
import {
  BASE_RATES,
  EXTRA_WEIGHT_COST,
  PAYMENT_FEES,
} from "../../utils/costRates";

export default function CostCalculatorForm() {
  const [total, setTotal] = useState(0);
  const [qts, setQts] = useState(1);
  const { register, handleSubmit, setValue } = useForm({
    mode: "all",
  });
  const calculateCost = (data) => {
    const { pType, dType, dLocation, payType, pWeight } = data;
    const baseRate = BASE_RATES[pType][dType][dLocation];
    const paymentFee = PAYMENT_FEES[dType][payType];
    const weightCharge = pWeight >= 3 ? EXTRA_WEIGHT_COST * pWeight : 0;
    const finalCost = baseRate + paymentFee + weightCharge;
    setTotal(finalCost);
  };
  return (
    <form onSubmit={handleSubmit(calculateCost)} className="fieldset cost-form">
      <label className="label text-base-300">Parcel Type</label>
      <select className="select w-full" {...register("pType")}>
        <option value="parcel">Parcel</option>
        <option value="fragile">Fragile</option>
      </select>
      <label className="label text-base-300 mt-2">Delivery Type</label>
      <select className="select w-full" {...register("dType")}>
        <option value="normal">Normal Delivery</option>
        <option value="hub">Hub Delivery</option>
        <option value="urgent">Urgent Delivery</option>
      </select>
      <label className="label text-base-300 mt-2">Delivery Location</label>
      <select className="select w-full" {...register("dLocation")}>
        <option value="same">Same City</option>
        <option value="outside">Other City</option>
      </select>
      <label className="label text-base-300 mt-2">Payment Type</label>
      <select className="select w-full" {...register("payType")}>
        <option value="cod">Cash On Delivery</option>
        <option value="prepaid">Pre-paid</option>
      </select>

      <label className="label text-base-300 mt-2">Parcel Weight</label>
      <div className="join w-full">
        <button
          type="button"
          disabled={qts <= 1}
          onClick={() => {
            setQts(qts - 1);
            setValue("pWeight", qts - 1);
          }}
          className="btn rounded-r-none! bg-base-100 border-base-content/20 shadow-none"
        >
          -
        </button>
        <input
          readOnly
          type="number"
          value={qts}
          className="input rounded-none! border-l-0 border-r-0"
          {...register("pWeight", {
            valueAsNumber: true,
          })}
        />
        <button
          disabled={qts >= 15}
          type="button"
          onClick={() => {
            setQts(qts + 1);
            setValue("pWeight", qts + 1);
          }}
          className="btn rounded-l-none! bg-base-100 border-base-content/20 shadow-none"
        >
          +
        </button>
      </div>
      <button className="btn mt-4">Calculate Now</button>
      <p className="text-center pt-10 pb-5 text-white text-3xl font-bold">
        ৳{total} BDT
      </p>
    </form>
  );
}
