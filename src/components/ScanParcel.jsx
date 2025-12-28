import { useState, useRef, useEffect } from "react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";

export const ScanParcelComponent = ({ scanParcelModalRef, onScan }) => {
  const [result, setResult] = useState("");
  const videoRef = useRef();
  const codeReaderRef = useRef(null);

  // Function to start scanning
  const startScanner = () => {
    if (!videoRef.current) return;
    codeReaderRef.current = new BrowserMultiFormatReader();
    codeReaderRef.current.decodeFromVideoDevice(
      null,
      videoRef.current,
      (res, err) => {
        if (res) {
          const text = res.getText();
          setResult(text);
          if (onScan) onScan(text);
        }
        if (err && !(err instanceof NotFoundException)) {
          console.error(err);
        }
      }
    );
  };

  // Stop scanning
  const stopScanner = () => {
    if (codeReaderRef.current) {
      codeReaderRef.current.reset();
      codeReaderRef.current = null;
    }
  };

  useEffect(() => {
    if (!scanParcelModalRef.current) return;

    const modal = scanParcelModalRef.current;

    const handleOpen = () => startScanner();
    const handleClose = () => stopScanner();

    modal.addEventListener("close", handleClose);
    modal.addEventListener("cancel", handleClose);
    modal.addEventListener("show", handleOpen);

    return () => {
      modal.removeEventListener("close", handleClose);
      modal.removeEventListener("cancel", handleClose);
      modal.removeEventListener("show", handleOpen);
      stopScanner();
    };
  }, [scanParcelModalRef]);

  return (
    <dialog ref={scanParcelModalRef} className="modal">
      <div className="modal-box">
        <video ref={videoRef} style={{ width: "100%" }} />
        <p>
          <span>Last result: </span>
          <span>{result}</span>
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
