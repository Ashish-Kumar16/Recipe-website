import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchRecipes = createAsyncThunk(
  "recipes/fetchRecipes",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        "https://recipe-website-arnr.onrender.com/api/recipes",
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch recipes");
    }
  },
);

export const fetchRecipeById = createAsyncThunk(
  "recipes/fetchRecipeById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `https://recipe-website-arnr.onrender.com/api/recipes/${id}`,
      );
      return response.data;
    } catch (err) {
      return rejectWithValue(
        err.response?.data || "Failed to fetch recipe details",
      );
    }
  },
);

const recipesSlice = createSlice({
  name: "recipes",
  initialState: {
    data: [], // List of recipes
    status: "idle", // Status for fetchRecipes
    error: null, // Error for fetchRecipes
    recipeDetail: null, // Single recipe details
    detailStatus: "idle", // Status for fetchRecipeById
    detailError: null, // Error for fetchRecipeById
  },
  reducers: {
    resetRecipeDetail: (state) => {
      state.recipeDetail = null;
      state.detailStatus = "idle";
      state.detailError = null;
    },
  },
  extraReducers: (builder) => {
    // Handle fetchRecipes
    builder
      .addCase(fetchRecipes.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchRecipes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchRecipes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Handle fetchRecipeById
      .addCase(fetchRecipeById.pending, (state) => {
        state.detailStatus = "loading";
      })
      .addCase(fetchRecipeById.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.recipeDetail = action.payload;
      })
      .addCase(fetchRecipeById.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.detailError = action.payload;
      });
  },
});

export const { resetRecipeDetail } = recipesSlice.actions;
export default recipesSlice.reducer;
