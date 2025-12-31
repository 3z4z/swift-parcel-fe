import { useTranslation } from "react-i18next";
import { useAuthStore } from "../../../stores/useAuthStore";
import { MapContainer, Marker, Popup, TileLayer, useMap } from "react-leaflet";
import { useForm } from "react-hook-form";
import useAxios from "../../../hooks/useAxios";
import { useState } from "react";
import dayjs from "dayjs";
import { useQuery } from "@tanstack/react-query";
import PageLoader from "../../loaders/PageLoader/PageLoader";

export default function UserDbHome() {
  const [location, setLocation] = useState(null);
  const [popup, setPopup] = useState(null);
  const { register, handleSubmit } = useForm({
    mode: "onSubmit",
  });
  const axios = useAxios();
  const { t } = useTranslation();
  const { user } = useAuthStore();
  const { data: analytics = {}, isLoading } = useQuery({
    queryKey: ["analytics", user?.email],
    queryFn: async () => {
      const res = await axios.get(`/parcels/analytics/${user?.email}`);
      return res.data;
    },
  });
  if (isLoading) return <PageLoader />;

  const handleFindParcel = async (data) => {
    const result = await axios.get(
      `/trackings/last-location?trackingId=${data.trackingId}`
    );
    setLocation(result?.data?.[0]?.location);
    setPopup([result?.data?.[0]?.details, result?.data?.[0]?.createdAt]);
  };
  function FlyToLocation({ location }) {
    const map = useMap();

    if (location?.lat && location?.lng) {
      map.flyTo([location.lat, location.lng], 15, {
        duration: 1,
      });
    }

    return null;
  }
  return (
    <>
      <h1 className="text-xl">
        {t("title")} {t("user")}!{" "}
        <span className="font-semibold">{user?.displayName}</span>
      </h1>
      <div className="grid xl:grid-cols-2 lg:grid-cols-3 gap-10 mt-5">
        <div>
          <div className="grid xl:grid-cols-2 lg:grid-cols-1 grid-cols-2 gap-6 *:bg-base-200">
            <div className="rounded-e-xl border-s-4 border-s-warning p-5 shadow flex justify-between items-center">
              <p className="font-semibold sm:text-lg">{t("status.pending")}</p>
              <p className="sm:text-2xl max-sm:font-bold">
                {analytics.pending || "0"}
              </p>
            </div>
            <div className="rounded-e-xl border-s-4 border-s-success p-5 shadow flex justify-between items-center">
              <p className="font-semibold sm:text-lg">
                {t("status.delivered")}
              </p>
              <p className="sm:text-2xl max-sm:font-bold">
                {analytics.delivered || "0"}
              </p>
            </div>
            <div className="rounded-e-xl border-s-4 border-s-error p-5 shadow flex justify-between items-center">
              <p className="font-semibold sm:text-lg">
                {t("status.cancelled")}
              </p>
              <p className="sm:text-2xl max-sm:font-bold">
                {analytics.cancelled || "0"}
              </p>
            </div>
            <div className="rounded-e-xl border-s-4 border-s-info p-5 shadow flex justify-between items-center">
              <p className="font-semibold sm:text-lg">{t("status.total")}</p>
              <p className="sm:text-2xl max-sm:font-bold">
                {analytics.total || "0"}
              </p>
            </div>
          </div>
        </div>
        <div className="xl:col-span-1 lg:col-span-2">
          <div className="shadow bg-base-200 p-5 rounded-2xl">
            <h3 className="mb-4 font-bold text-xl">Where is my parcel?</h3>
            <form className="join" onSubmit={handleSubmit(handleFindParcel)}>
              <input
                type="search"
                className="input min-w-52 join-item rounded-e-none!"
                placeholder="Enter a tracking ID"
                {...register("trackingId")}
              />
              <button className="btn btn-primary join-item  rounded-s-none!">
                Find
              </button>
            </form>
            <div className="lg:h-150 sm:h-110 h-80 w-full flex mt-8">
              <MapContainer
                center={[23.8103, 90.4125]}
                zoom={13}
                className="w-full h-full z-0!"
                scrollWheelZoom={false}
              >
                <FlyToLocation location={location} />
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker
                  position={
                    location
                      ? [location?.lat, location?.lng]
                      : [23.8103, 90.4125]
                  }
                >
                  <Popup>
                    <span className="font-semibold me-1">
                      {popup?.[0] || "Find your parcel now!"}
                    </span>
                    <span className="text-neutral/70">
                      {popup
                        ? dayjs(popup?.[1]).format("MMM DD, YYYY @ hh:mm:ss a")
                        : null}
                    </span>
                  </Popup>
                </Marker>
              </MapContainer>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
