"use client";
import { Provider } from "react-redux";
import { useEffect } from "react";
import { store, persistor } from "./store";

export default function ReduxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if (persistor && typeof window !== "undefined") {
      const unsubscribe = persistor.subscribe(() => {});
      return () => unsubscribe();
    }
  }, []);

  return <Provider store={store}>{children}</Provider>;
}
