import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';


export const createOrderInSanity = createAsyncThunk(
  'order/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await fetch('/api/createOrder', {
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
     
      return rejectWithValue('Network error'); 
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
      return rejectWithValue(error.message); 
    }
  }
);


const orderSlice = createSlice({
  name: 'order',
  initialState: {
    order: null,
    status: 'idle',
    error: "",
 
  },
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrderInSanity.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createOrderInSanity.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.order = action.payload.createdOrder;
      })
      .addCase(createOrderInSanity.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload?.message || 'Failed to create order';
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
        state.error = action.payload || 'Failed to fetch order';
      });
  },
});


export default orderSlice.reducer;
