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
      console.error('Network error:', error);
      return rejectWithValue('Network error'); 
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
      });
  },
});


export default orderSlice.reducer;
