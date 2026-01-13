import { configureStore } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { combineReducers } from "redux";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";
import cartReducer from "./slices/cartSlice";
import orderReducer from "./slices/orderSlice";
import wishlistReducer from "./slices/wishlistSlice";

//  noop storage for SSR
const createNoopStorage = () => {
  return {
    getItem() {
      return Promise.resolve(null);
    },
    setItem(_key: string, value: unknown) {
      return Promise.resolve(value);
    },
    removeItem() {
      return Promise.resolve();
    },
  };
};

//  localStorage only on client side
const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createNoopStorage();

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart", "order", "wishlist"],
};

const rootReducer = combineReducers({
  cart: cartReducer,
  order: orderReducer,
  wishlist: wishlistReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});

export const persistor = persistStore(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
