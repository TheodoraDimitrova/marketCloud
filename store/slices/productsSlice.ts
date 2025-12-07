import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Product } from "@/types/product";
import { normalizeError } from "../utils/errorUtils";

type ProductState = {
  products: Product[];
  filteredProducts: Product[];
  productDetails: Product | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: ProductState = {
  products: [],
  filteredProducts: [],
  productDetails: null,
  status: "idle",
  error: null,
};

export const fetchAllProducts = createAsyncThunk(
  "products/fetchAllProducts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch("/api/products");

      if (!response.ok) {
        const errorData = await response.json();
        return rejectWithValue(
          normalizeError(errorData.message || "Failed to fetch products")
        );
      }

      const products = await response.json();
      return products;
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

export const fetchProductsByCategory = createAsyncThunk(
  "products/fetchProductsByCategory",
  async (category: string, { rejectWithValue }) => {
    try {
      const res = await fetch(`/api/products/category/${category}`);

      if (!res.ok) {
        const errorData = await res.json();
        return rejectWithValue(
          normalizeError(
            errorData.message || "Failed to fetch products by category"
          )
        );
      }

      const filteredProducts = await res.json();
      return filteredProducts;
    } catch (error) {
      return rejectWithValue(normalizeError(error));
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
      state.status = "succeeded";
    },
    setProductDetails: (state, action) => {
      state.productDetails = action.payload;
      state.status = "succeeded";
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllProducts.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAllProducts.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.products = action.payload;
        state.filteredProducts = action.payload;
      })
      .addCase(fetchAllProducts.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.payload as string) || "Failed to fetch products";
      })
      .addCase(fetchProductsByCategory.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchProductsByCategory.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.filteredProducts = action.payload;
      })
      .addCase(fetchProductsByCategory.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.payload as string) || "Failed to fetch products by category";
      });
  },
});

export const { setProducts, setProductDetails } = productSlice.actions;
export default productSlice.reducer;
