import { create } from 'zustand';

type StoreState = {
    loader: boolean,
    setLoader: (loader: boolean) => void,

    localLoader: boolean,
    setLocalLoader: (loader: boolean) => void,
};

const useStore = create<StoreState>((set) => ({
    loader: false,
    setLoader: (loader) => set({loader: loader}),
    
    localLoader: false,
    setLocalLoader: (localLoader) => set({localLoader: localLoader}),
}));

export default useStore;