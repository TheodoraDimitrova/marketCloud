import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Order } from "@/lib/types/order";
import { normalizeError } from "../utils/errorUtils";

interface OrderState {
  order: Order | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string;
}

export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (orderData: Order, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(
          normalizeError(errorData.message || "Failed to create order")
        );
      }
      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

export const fetchOrder = createAsyncThunk(
  "order/fetchOrder",
  async (orderId: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (!res.ok) {
        const errorData = await res.json();
        return rejectWithValue(
          normalizeError(errorData.message || "Failed to fetch order")
        );
      }

      return await res.json();
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

const orderSlice = createSlice({
  name: "order",
  initialState: {
    order: null,
    status: "idle",
    error: "",
  } as OrderState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.status = "idle";
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.order = action.payload.createdOrder;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to create order";
      })
      .addCase(fetchOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.order = action.payload;
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to fetch order";
      });
  },
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
