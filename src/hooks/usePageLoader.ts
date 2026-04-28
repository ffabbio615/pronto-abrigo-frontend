import { useEffect } from "react";
import useStore from "../store/useStore";

export function usePageLoader(time = 2000) {
  const { setLoader } = useStore();

  useEffect(() => {
    setLoader(true);

    const timeout = setTimeout(() => {
      setLoader(false);
    }, time);

    return () => clearTimeout(timeout);
  }, [setLoader, time]);
}