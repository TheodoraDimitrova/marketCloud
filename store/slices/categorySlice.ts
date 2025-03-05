
"use client";
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import sanityClient from '../../lib/sanityClient'


export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async () => {
    const query = '*[_type == "category"]' 
    const categories = await sanityClient.fetch(query)
    return categories
  }
)

const categorySlice = createSlice({
  name: 'categories',
  initialState: {
    categories: [],
    status: 'idle',
    error: null,
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
        state.error = action.error.message
      })
  },
})

export default categorySlice.reducer
