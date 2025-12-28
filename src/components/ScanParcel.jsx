import { useState, useRef, useEffect } from "react";
import { BrowserMultiFormatReader, NotFoundException } from "@zxing/library";

export const ScanParcelComponent = ({ scanParcelModalRef, onScan }) => {
  const [result, setResult] = useState("");
  const videoRef = useRef();

  useEffect(() => {
    if (!videoRef.current) return;

    const codeReader = new BrowserMultiFormatReader();

    codeReader.decodeFromVideoDevice(null, videoRef.current, (res, err) => {
      if (res) {
        const text = res.getText();
        setResult(text);
        if (onScan) onScan(text);
      }
      if (err && !(err instanceof NotFoundException)) {
        console.error(err);
      }
    });

    return () => codeReader.reset();
  }, [onScan]);

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
