import {
  MapContainer,
  Marker,
  Polyline,
  Popup,
  TileLayer,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
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
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Polyline
              positions={locations.map((l) => l.coords)}
              color="#4A89F3"
              weight={4}
            />
            {locations.map((l, i) => (
              <Marker key={i} position={l?.coords}>
                <Popup>{l?.details}</Popup>
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
