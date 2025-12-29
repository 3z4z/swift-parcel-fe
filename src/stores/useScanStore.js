import { create } from "zustand";

export const useScanStore = create((set) => ({
  scannedOrderTId: null,
  setScannedOrderTId: (id) => set({ scannedOrderTId: id }),
  clearScan: () => set({ scannedOrderTId: null }),
}));
