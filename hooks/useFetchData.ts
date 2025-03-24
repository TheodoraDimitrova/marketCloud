import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store/store";  
import { useEffect } from "react";
import { AsyncThunkAction } from "@reduxjs/toolkit";

// We expect `fetchDataAction` to be a function that returns a thunk
export const useFetchData = <T>(
  fetchDataAction: () => AsyncThunkAction<T, void, object>, // Action creator, not the action itself
  stateKey: keyof RootState
) => {
  const dispatch = useDispatch();

  const { status, error } = useSelector((state: RootState) => state[stateKey]);

  useEffect(() => {
    if (status === "idle" || status === "failed") {
      // Call the action creator to get the thunk and dispatch it
      dispatch(fetchDataAction());
    }
  }, [dispatch, status, fetchDataAction]);

  return { status, error };
};
