import { useState } from "react";
import { useZxing } from "react-zxing";

export const ScanParcelComponent = (scanParcelModalRef) => {
  const [result, setResult] = useState("");
  const { ref } = useZxing({
    onDecodeResult(result) {
      setResult(result.getText());
    },
  });

  return (
    <dialog ref={scanParcelModalRef} className="modal">
      <div className="modal-box">
        <video ref={ref} />
        <p>
          <span>Last result:</span>
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
