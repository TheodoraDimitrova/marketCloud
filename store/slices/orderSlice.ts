import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { Order } from '@/types/order';

interface ErrorPayload {
  message: string;
}
interface OrderState {
  order: Order | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string;
}

const handleError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (orderData: Order, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/orders/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(errorData); 
      }
      const data = await response.json();
      return data; 
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const fetchOrder = createAsyncThunk(
  "order/fetchOrder",
  async (orderId: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      if (!res.ok) throw new Error("Failed to fetch order");
  
      return await res.json();
    } catch (error) {
      return rejectWithValue(handleError(error));;
    }
  }
);


const orderSlice = createSlice({
  name: 'order',
  initialState: {
    order: null,
    status: 'idle',
    error: "",
 
  } as OrderState,
  reducers: {
    clearOrder: (state) => {
      state.order = null;
      state.status = 'idle';
      state.error = "";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.order = action.payload.createdOrder;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = 'failed';
        const errorPayload = action.payload as ErrorPayload; 
        state.error = errorPayload?.message || 'Failed to create order'; 
      })
      .addCase(fetchOrder.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchOrder.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.order = action.payload; 
      })
      .addCase(fetchOrder.rejected, (state, action) => {
        state.status = 'failed';
        const errorPayload = action.payload as ErrorPayload; 
        state.error = errorPayload?.message || 'Failed to fetch order'; 
       
      });
  },
});

export const { clearOrder } = orderSlice.actions;
export default orderSlice.reducer;
