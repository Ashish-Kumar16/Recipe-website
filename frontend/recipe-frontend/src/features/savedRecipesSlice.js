import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchSavedRecipes = createAsyncThunk(
  "savedRecipes/fetchSavedRecipes",
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.get(
        "https://recipe-website-arnr.onrender.com/api/recipes/saved",
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
);

export const updateRecipeOrder = createAsyncThunk(
  "savedRecipes/updateRecipeOrder",
  async (reorderedRecipes, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const recipeIds = reorderedRecipes.map((recipe) => recipe._id);
      const response = await axios.put(
        "https://recipe-website-arnr.onrender.com/api/recipes/saved/order",
        { recipeIds },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      return response.data; // Updated savedRecipes array
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
);

export const deleteRecipe = createAsyncThunk(
  "savedRecipes/deleteRecipe",
  async (recipeId, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      await axios.delete(
        `https://recipe-website-arnr.onrender.com/api/recipes/saved/${recipeId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return recipeId; // Return the deleted recipe's ID for state update
    } catch (error) {
      return rejectWithValue(error.response?.data?.error || error.message);
    }
  },
);

const savedRecipesSlice = createSlice({
  name: "savedRecipes",
  initialState: {
    data: [],
    status: "idle",
    error: null,
  },
  reducers: {
    reorderRecipes(state, action) {
      state.data = action.payload; // Local reorder before persisting
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Saved Recipes
      .addCase(fetchSavedRecipes.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchSavedRecipes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.data = action.payload;
      })
      .addCase(fetchSavedRecipes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      // Update Recipe Order
      .addCase(updateRecipeOrder.pending, (state) => {
        state.error = null; // Clear previous errors
      })
      .addCase(updateRecipeOrder.fulfilled, (state, action) => {
        state.data = action.payload; // Sync with backend
      })
      .addCase(updateRecipeOrder.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete Recipe
      .addCase(deleteRecipe.pending, (state) => {
        state.error = null; // Clear previous errors
      })
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.data = state.data.filter(
          (recipe) => recipe._id !== action.payload,
        ); // Remove the deleted recipe from state
      })
      .addCase(deleteRecipe.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { reorderRecipes } = savedRecipesSlice.actions;
export default savedRecipesSlice.reducer;
