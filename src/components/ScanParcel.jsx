import { useRef, useEffect } from "react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import { useScanStore } from "../stores/useScanStore";
import { useNavigate } from "react-router";

export const ScanParcelComponent = ({ scanParcelModalRef, onScan }) => {
  const navigate = useNavigate();
  const { setScannedOrderTId, scannedOrderTId } = useScanStore();
  const videoRef = useRef();

  useEffect(() => {
    if (!videoRef.current) return;

    const codeReader = new BrowserMultiFormatReader();

    codeReader.decodeFromVideoDevice(null, videoRef.current, (res, err) => {
      if (res) {
        const text = res.getText();
        setScannedOrderTId(text);
        if (onScan) onScan(text);
        navigate("/assigned-orders");
      }
      if (err && !(err instanceof NotFoundException)) {
        console.error(err);
      }
    });

    return () => codeReader.reset();
  }, [onScan, setScannedOrderTId, navigate]);

  return (
    <dialog ref={scanParcelModalRef} className="modal">
      <div className="modal-box">
        <video ref={videoRef} style={{ width: "100%" }} />
        <p>
          <span>Last result: </span>
          <span>{scannedOrderTId}</span>
        </p>
        <div className="modal-action">
          <button
            className="btn btn-primary"
            onClick={() => scanParcelModalRef.current.close()}
          >
            Close
          </button>
        </div>
      </div>
    </dialog>
  );
};
