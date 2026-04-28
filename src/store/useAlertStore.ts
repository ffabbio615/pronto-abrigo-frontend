import { create } from "zustand";

type AlertState = {
  message: string | null;
  resolve: (() => void) | null;
  alert: (msg: string) => Promise<void>;
  close: () => void;
};

const useAlertStore = create<AlertState>((set) => ({
  message: null,
  resolve: null,

  alert: (msg) =>
    new Promise((resolve) => {
      set({ message: msg, resolve });
    }),

  close: () =>
    set((state) => {
      state.resolve?.(); // libera o await
      return { message: null, resolve: null };
    }),
}));

export default useAlertStore;