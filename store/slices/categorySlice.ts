

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import sanityClient from '../../lib/sanityClient'


export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const query = '*[_type == "category"]' 
      const categories = await sanityClient.fetch(query)
      return categories
    } catch (error) {
      let errorMessage = "An unknown error occurred"; 
      if (error instanceof Error) {
        errorMessage = error.message; 
      }
      return rejectWithValue(errorMessage);

    }
  }
)

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [] ,
    status: 'idle',
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCategories.pending, (state) => {
        state.status = 'loading'
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.status = 'succeeded'
        state.categories = action.payload
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.status = 'failed'
        state.error = action.payload as string;
      })
  },
})



export default categorySlice.reducer
