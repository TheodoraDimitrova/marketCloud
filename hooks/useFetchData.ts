import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";  
import { useEffect } from "react";



export const useFetchData = (fetchDataAction: any, stateKey: keyof RootState) => {
  const dispatch = useDispatch();

  const { status, error } = useSelector((state: RootState) => state[stateKey]);

  useEffect(() => {
    if (status === "idle" || status === "failed") {
      dispatch(fetchDataAction());
    }
  }, [dispatch, status, fetchDataAction]);

  return { status, error };
};
