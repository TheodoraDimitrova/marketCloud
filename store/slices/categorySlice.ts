

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import sanityClient from '../../lib/sanityClient'
import { Category } from "@/types/category";

interface CategoryState {
  categories: Category[]; 
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
}

const initialState: CategoryState = {
  categories: [], 
  status: "idle",
  error: null,
};


export const fetchCategories = createAsyncThunk(
  'categories/fetchCategories',
  async (_, { rejectWithValue }) => {
    try {
      const query = `*[_type == "category"]{
        ...,
        "totalProducts": count(*[_type == "product" && references(^._id)])
      }`
      
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
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
      state.status="succeeded"
    },
  },
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

export const { setCategories } = categorySlice.actions;

export default categorySlice.reducer
