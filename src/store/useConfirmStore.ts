import { create } from "zustand";

type ConfirmState = {
  message: string | null;
  resolve: ((value: boolean) => void) | null;
  confirm: (msg: string) => Promise<boolean>;
  confirmYes: () => void;
  confirmNo: () => void;
};

const useConfirmStore = create<ConfirmState>((set) => ({
  message: null,
  resolve: null,

  confirm: (msg) =>
    new Promise((resolve) => {
      set({ message: msg, resolve });
    }),

  confirmYes: () =>
    set((state) => {
      state.resolve?.(true);
      return { message: null, resolve: null };
    }),

  confirmNo: () =>
    set((state) => {
      state.resolve?.(false);
      return { message: null, resolve: null };
    }),
}));

export default useConfirmStore;