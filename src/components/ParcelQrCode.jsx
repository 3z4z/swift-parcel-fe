import { useEffect, useState } from "react";
import QRCode from "qrcode";

export default function ParcelQRCode({ trackingId }) {
  const [qr, setQr] = useState("");

  useEffect(() => {
    if (!trackingId) return null;
    QRCode.toDataURL(trackingId).then((url) => {
      setQr(url);
    });
  }, [trackingId, qr]);

  return (
    <figure className="rounded-xl shadow overflow-hidden w-max">
      <img src={qr} alt="Parcel QR Code" style={{ width: 150, height: 150 }} />
    </figure>
  );
}
