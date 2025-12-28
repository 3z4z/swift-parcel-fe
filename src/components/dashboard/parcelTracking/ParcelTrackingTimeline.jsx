import { FaCheckCircle } from "react-icons/fa";
import { useQuery } from "@tanstack/react-query";
import useAxios from "../../../hooks/useAxios";
import dayjs from "dayjs";
import useParcelProgress from "../../../hooks/useStatus";
import { LuMapPin } from "react-icons/lu";
import { useRef } from "react";
import ParcelTrackingMapModal from "./ParcelTrackingMapModal";
import { timeLines } from "../../../utils/timelines";

export default function ParcelTrackingTimeline({ parcel }) {
  const { checkStatus } = useParcelProgress(parcel?.parcelMovementStatus);

  const axios = useAxios();
  const { data: logs = [], isLoading } = useQuery({
    queryKey: ["logs", parcel?.trackingId],
    queryFn: async () => {
      const res = await axios.get(
        `/trackings?trackingId=${parcel?.trackingId}`
      );
      return res.data;
    },
  });
  const mapModalRef = useRef();
  const showMapModal = () => {
    mapModalRef.current.showModal();
  };
  return (
    <div>
      <ul className="timeline">
        {timeLines.map((timeline, index) => {
          const { isCompleted, isActive } = checkStatus(timeline.key);
          const isHighlighted = isCompleted || isActive;
          return (
            <li key={index}>
              {index > 0 && (
                <hr className={isHighlighted ? "bg-success" : ""} />
              )}
              <div className="timeline-start mb-2">
                <figure
                  className={`w-9 h-9 ${isHighlighted ? "" : "grayscale"}`}
                >
                  <img
                    src={timeline.icon}
                    alt=""
                    className="filter drop-shadow-[1px_1px_1px_#0007]"
                  />
                </figure>
              </div>
              <div className="timeline-middle">
                <FaCheckCircle
                  className={`size-4 ${
                    isHighlighted ? "text-success" : "text-neutral/50"
                  }`}
                />
              </div>
              <div
                className={`timeline-end timeline-box w-24 text-center ${
                  isActive
                    ? "text-primary bg-base-100 font-semibold"
                    : "text-neutral/50 bg-base-200 shadow-none"
                }`}
              >
                {timeline.title}
              </div>
              {timeLines.length > index + 1 && (
                <hr
                  className={`${
                    checkStatus(timeLines[index + 1].key).isHighlighted
                      ? "bg-success"
                      : ""
                  }`}
                />
              )}
            </li>
          );
        })}
      </ul>
      <div className="flex mt-8 mb-3 items-center justify-between">
        <h3 className="text-xl font-bold">Timeline view</h3>
        <button className="btn btn-primary" onClick={showMapModal}>
          <LuMapPin className="size-4" />
          View on Map
        </button>
      </div>
      <div>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          logs.map((log) => (
            <div
              key={log._id}
              className={`${
                log.deliveryStatus !== "cancelled"
                  ? "first:border-s-success"
                  : "first:border-s-error"
              } border-s-neutral/50 border-s-3 mb-3 last:mb-0 my-4 px-3 rounded-e-2xl min-w-84 w-max group`}
            >
              <p
                className={`${
                  log.deliveryStatus !== "cancelled"
                    ? "group-first:text-accent"
                    : "group-first:text-error"
                } text-neutral/90 font-medium text-[0.9375rem]`}
              >
                {log.details}
              </p>
              <small className="group-first:text-neutral/80 text-neutral/50">
                {dayjs(log.createdAt).format("MMM DD, YYYY @ hh:mm:ss a")}
              </small>
            </div>
          ))
        )}
      </div>
      <ParcelTrackingMapModal mapModalRef={mapModalRef} logs={logs} />
    </div>
  );
}
