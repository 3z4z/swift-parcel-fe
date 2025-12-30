import { useForm, useWatch } from "react-hook-form";
import { useAuthStore } from "../../stores/useAuthStore";
import { use, useState } from "react";
import useAxios from "../../hooks/useAxios";
import Swal from "sweetalert2";
import AuthSpinnerLoader from "../loaders/AuthSpinner";
import { useTranslation } from "react-i18next";
// import { getGeoLocation } from "../../utils/geoLocation";

export default function AddParcelForm({ getLocations }) {
  const { t } = useTranslation();
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
      <div className="flex max-sm:flex-col mb-2 max-sm:gap-3 gap-8">
        <div className="flex-1">
          <label className="label">{t("form.labels.parcel_type")}</label>
          <select className="select w-full" {...register("productType")}>
            <option value="parcel">Parcel</option>
            <option value="fragile">Fragile</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="label">{t("form.labels.delivery_type")}</label>
          <select className="select w-full" {...register("deliveryType")}>
            <option value="normal-delivery">Normal Delivery</option>
            <option value="urgent-delivery">Urgent Delivery (Same Day)</option>
            <option value="hub-delivery">Hub Delivery</option>
          </select>
        </div>
      </div>
      <div className="flex max-sm:flex-col mb-2 max-sm:gap-3 gap-8">
        <div className="flex-1">
          <label className="label">{t("form.labels.parcel_weight")}</label>
          <input
            type="number"
            placeholder={t("form.placeholders.parcel_weight")}
            className="input w-full"
            {...register("parcelWeight", {
              valueAsNumber: true,
              required: t("form.validations.parcel_weight"),
              validate: (value) =>
                Number.isInteger(value) ||
                t("form.validations.parcel_weight_int"),
              min: {
                value: 1,
                message: t("form.validations.parcel_weight_min"),
              },
              max: {
                value: 10,
                message: t("form.validations.parcel_weight_max"),
              },
            })}
          />
          {errors.parcelWeight && (
            <p className="text-error">{errors.parcelWeight.message}</p>
          )}
        </div>
        <div className="flex-1">
          <label className="label">{t("form.labels.product_qts")}</label>
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
      <div className="flex max-sm:flex-col mb-2 max-sm:gap-3 gap-8">
        <div className="flex-1">
          <label className="label">{t("form.labels.payment_type")}</label>
          <select className="select w-full" {...register("paymentType")}>
            <option value="cod">Cash On Delivery</option>
            <option value="prepaid">Pre-paid</option>
          </select>
        </div>
        <div className="flex-1">
          <label className="label">{t("form.labels.amount_collect")}</label>
          <input
            disabled={watchPaymentType === "prepaid"}
            type="number"
            className="input w-full disabled:bg-base-100"
            placeholder={t("form.placeholders.amount_collect")}
            {...register("pickupAmount", {
              valueAsNumber: true,
              required:
                watchPaymentType === "cod"
                  ? t("form.validations.pickup_amount")
                  : false,
            })}
          />
          {errors.pickupAmount && (
            <p className="text-error">{errors.pickupAmount.message}</p>
          )}
        </div>
      </div>
      <div className="flex max-sm:flex-col mb-2 max-sm:gap-3 gap-8">
        <div className="flex-1">
          <label className="label">{t("form.labels.pickup_division")}</label>
          <select
            className="select w-full"
            {...register("pickupDivision", {
              required: t("form.validations.pickup_division"),
            })}
          >
            <option value="">{t("form.options.select_pickup_division")}</option>
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
          <label className="label">{t("form.labels.pickup_district")}</label>
          <select
            className="select w-full"
            {...register("pickupDistrict", {
              required: t("form.validations.pickup_district"),
            })}
          >
            <option value="">{t("form.options.select_pickup_district")}</option>
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
      <label className="label">{t("form.labels.pickup_address")}</label>
      <textarea
        className="textarea w-full"
        placeholder={t("form.placeholders.pickup_address")}
        {...register("pickupAddress", {
          required: t("form.validations.pickup_address"),
        })}
      ></textarea>
      {errors.pickupAddress && (
        <p className="text-error">{errors.pickupAddress.message}</p>
      )}
      <label className="label mt-2">{t("form.labels.instructions")}</label>
      <textarea
        className="textarea w-full"
        placeholder={t("form.placeholders.instructions")}
        {...register("optionalInstructions")}
      ></textarea>
      <div className="flex max-sm:flex-col mt-4 mb-2 max-sm:gap-3 gap-8">
        <div className="flex-1">
          <label className="label">{t("form.labels.recipient_name")}</label>
          <input
            type="text"
            placeholder={t("form.placeholders.recipient_name")}
            className="input w-full"
            {...register("recipientName", {
              required: t("form.validations.recipient_name"),
            })}
          />
          {errors.recipientName && (
            <p className="text-error">{errors.recipientName.message}</p>
          )}
        </div>
        <div className="flex-1">
          <label className="label">{t("form.labels.recipient_contact")}</label>
          <input
            type="text"
            placeholder={t("form.placeholders.recipient_contact")}
            className="input w-full"
            {...register("recipientContact", {
              required: t("form.validations.recipient_contact"),
            })}
          />
          {errors.recipientContact && (
            <p className="text-error">{errors.recipientContact.message}</p>
          )}
        </div>
      </div>

      <div className="flex max-sm:flex-col mb-2 max-sm:gap-3 gap-8">
        <div className="flex-1">
          <label className="label">{t("form.labels.recipient_division")}</label>
          <select
            className="select w-full"
            {...register("recipientDivision", {
              required: t("form.validations.recipient_division"),
            })}
          >
            <option value="">
              {t("form.options.select_recipient_division")}
            </option>
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
          <label className="label">{t("form.labels.recipient_district")}</label>
          <select
            className="select w-full"
            {...register("recipientDistrict", {
              required: t("form.validations.recipient_district"),
            })}
          >
            <option value="">
              {t("form.options.select_recipient_district")}
            </option>
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
      <label className="label">{t("form.labels.recipient_address")}</label>
      <textarea
        className="textarea w-full"
        placeholder={t("form.placeholders.recipient_address")}
        {...register("recipientAddress", {
          required: t("form.validations.recipient_address"),
        })}
      ></textarea>
      {errors.recipientAddress && (
        <p className="text-error">{errors.recipientAddress.message}</p>
      )}
      <button disabled={isLoading} className="btn btn-primary w-max px-10 mt-2">
        {isLoading && <AuthSpinnerLoader />}
        {isLoading ? t("form.actions.sending") : t("form.actions.send_now")}
      </button>
    </form>
  );
}
