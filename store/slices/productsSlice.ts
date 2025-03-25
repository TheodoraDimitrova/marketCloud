'use client'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'; 
import sanityClient from '@/lib/sanityClient';
import { Product } from '@/types/product';

type ProductState = {
  products: Product[];
  filteredProducts: Product[];
  productDetails: Product | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};

const initialState: ProductState = {
  products: [],
  filteredProducts:[],
  productDetails: null,
  status: 'idle',
  error: null,
};

const handleError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unknown error occurred';
};

export const fetchAllProducts = createAsyncThunk(
  'products/fetchAllProducts',
  async (_, { rejectWithValue }) => {
    try {
      const query = '*[_type == "product"]'; 
      const products = await sanityClient.fetch(query);
    
      return products;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async (category: string, { rejectWithValue }) => {
    try {
      const query = '*[_type == "product" && references($category)]';
      const filteredProducts = await sanityClient.fetch(query, { category });
      return filteredProducts;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);

export const fetchProductDetails = createAsyncThunk(
  'products/fetchProductDetails',
  async (slug: string, { rejectWithValue }) => {
    try {
      const query = `*[_type == "product" && slug.current == $slug][0]`;
      const product = await sanityClient.fetch(query, { slug });
      return product;
    } catch (error) {
      return rejectWithValue(handleError(error));
    }
  }
);




const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
      state.status="succeeded"
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
        state.filteredProducts = action.payload; 
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.filteredProducts = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(fetchProductDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.productDetails = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
  },
});
export const { setProducts } = productSlice.actions;
export default productSlice.reducer;
