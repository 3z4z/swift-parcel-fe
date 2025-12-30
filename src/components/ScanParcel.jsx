import { useRef } from "react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";
import { useScanStore } from "../stores/useScanStore";
import { useNavigate } from "react-router";

export const ScanParcelComponent = ({ scanParcelModalRef, onScan }) => {
  const navigate = useNavigate();
  const { setScannedOrderTId, scannedOrderTId } = useScanStore();
  const videoRef = useRef();
  const codeReaderRef = useRef(null);

  const startScanner = () => {
    if (!videoRef.current) return;

    codeReaderRef.current = new BrowserMultiFormatReader();

    codeReaderRef.current.decodeFromVideoDevice(
      null,
      videoRef.current,
      (res, err) => {
        if (res) {
          const text = res.getText();
          setScannedOrderTId(text);
          if (onScan) onScan(text);
          navigate("/assigned-orders");
        }
        if (err && !(err instanceof NotFoundException)) {
          console.error(err);
        }
      }
    );
  };

  const stopScanner = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
      codeReaderRef.current = null;
    }
  };

  const handleClose = () => {
    stopScanner();
    scanParcelModalRef.current.close();
  };

  return (
    <dialog
      ref={scanParcelModalRef}
      className="modal"
      onClick={(e) => e.target === scanParcelModalRef.current && handleClose()}
    >
      <div className="modal-box">
        <video ref={videoRef} style={{ width: "100%" }} />
        <p>
          <span>Last result: </span>
          <span>{scannedOrderTId}</span>
        </p>
        <div className="modal-action">
          <button className="btn btn-primary" onClick={handleClose}>
            Close
          </button>
          <button className="btn btn-secondary" onClick={startScanner}>
            Start Scan
          </button>
        </div>
      </div>
    </dialog>
  );
};
