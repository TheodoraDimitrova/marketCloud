import { createSlice } from "@reduxjs/toolkit";
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

const categorySlice = createSlice({
  name: "categories",
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
      state.status = "succeeded";
    },
  },
});

export const { setCategories } = categorySlice.actions;

export default categorySlice.reducer;
