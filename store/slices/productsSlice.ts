'use client'
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import sanityClient from '@/lib/sanityClient';


type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: { asset: { url: string } };
  category: string;
};

type ProductState = {
  products: Product[];
  productDetails: Product | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
};


export const fetchAllProducts = createAsyncThunk(
  'products/fetchAllProducts',
  async (_, { rejectWithValue }) => {
    try {
      const query = '*[_type == "product"]'; 
      const products = await sanityClient.fetch(query);
    
      return products;
    } catch (error) {
      let errorMessage = 'An unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return rejectWithValue(errorMessage);
    }
  }
);


export const fetchProductsByCategory = createAsyncThunk(
  'products/fetchProductsByCategory',
  async (category: string, { rejectWithValue }) => {
    try {
      const query = '*[_type == "product" && category == $category]';
      const products = await sanityClient.fetch(query, { category });
   
      return products;
    } catch (error) {
      let errorMessage = 'An unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return rejectWithValue(errorMessage);
    }
  }
);


export const fetchProductDetails = createAsyncThunk(
  'products/fetchProductDetails',
  async (productId: string, { rejectWithValue }) => {
    try {
      const query = `*[_type == "product" && _id == $productId][0]`;
      const product = await sanityClient.fetch(query, { productId });
      return product;
    } catch (error) {
      let errorMessage = 'An unknown error occurred';
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchProductsByTag = createAsyncThunk(
  "products/fetchProductsByTag",
  async (tag: string, { rejectWithValue }) => {
    try {
      const query = '*[_type == "product" && tags[].label match $tag]';
      const products = await sanityClient.fetch(query, { tag });
      return products;
    } catch (error) {
      let errorMessage = "An unknown error occurred";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      return rejectWithValue(errorMessage);
    }
  }
);


const initialState: ProductState = {
  products: [],
  productDetails: null,
  status: 'idle',
  error: null,
};


const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products = action.payload;
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
        state.products = action.payload;
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
      .addCase(fetchProductsByTag.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.products  = action.payload;
      })
      .addCase(fetchProductsByTag.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default productSlice.reducer;
