import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
export default function ParcelTrackingMapModal({ logs, mapModalRef }) {
  const locations = logs?.map((l) => ({
    coords: [l?.location?.lat, l?.location?.lng],
    details: l?.details,
  }));

  if (!locations || locations.length === 0) return null;

  // Group logs by same coordinate
  const grouped = logs.reduce((acc, log) => {
    const coords = [log.location.lat, log.location.lng];
    const key = `${coords[0]},${coords[1]}`;

    if (!acc[key]) {
      acc[key] = { coords, logs: [] };
    }

    acc[key].logs.push({
      details: log.details,
      createdAt: log.createdAt,
    });

    return acc;
  }, {});
  console.log("grouped", grouped);

  return (
    <dialog ref={mapModalRef} className="modal">
      <div className="modal-box max-w-2xl">
        <div className="flex h-96 w-full mb-3 overflow-hidden rounded-xl shadow border border-neutral/15">
          <MapContainer
            center={locations[0]?.coords}
            zoom={13}
            scrollWheelZoom={false}
            className="w-full h-full"
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            <Polyline
              positions={locations.map((l) => l.coords)}
              color="#4A89F3"
              weight={4}
            />
            {Object.values(grouped).map((loc, i) => (
              <Marker key={i} position={loc.coords}>
                <Popup>
                  <ul>
                    {loc.logs.map((logItem, idx) => (
                      <li key={idx} className="border-b border-neutral/10">
                        <p className="font-medium mt-2!">{logItem.details}</p>
                        <p className="opacity-60 my-2! text-xs!">
                          {new Date(logItem.createdAt).toLocaleString()}
                        </p>
                      </li>
                    ))}
                  </ul>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="modal-action">
          <button
            className="btn btn-primary btn-soft border-primary/25"
            onClick={() => mapModalRef.current.close()}
          >
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
}
