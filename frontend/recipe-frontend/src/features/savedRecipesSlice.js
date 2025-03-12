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

export const saveRecipe = createAsyncThunk(
  "savedRecipes/saveRecipe",
  async (recipeData, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No authentication token found");

      const response = await axios.post(
        "https://recipe-website-arnr.onrender.com/api/recipes/save",
        recipeData,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      return response.data.recipe; // Ensure backend returns the saved recipe object
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
      return recipeId;
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
      return response.data;
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
      state.data = action.payload;
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
      // Save Recipe
      .addCase(saveRecipe.pending, (state) => {
        state.error = null;
      })
      .addCase(saveRecipe.fulfilled, (state, action) => {
        state.data.push(action.payload); // Add the newly saved recipe
      })
      .addCase(saveRecipe.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Delete Recipe
      .addCase(deleteRecipe.pending, (state) => {
        state.error = null;
      })
      .addCase(deleteRecipe.fulfilled, (state, action) => {
        state.data = state.data.filter(
          (recipe) => recipe._id !== action.payload,
        );
      })
      .addCase(deleteRecipe.rejected, (state, action) => {
        state.error = action.payload;
      })
      // Update Recipe Order
      .addCase(updateRecipeOrder.pending, (state) => {
        state.error = null;
      })
      .addCase(updateRecipeOrder.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(updateRecipeOrder.rejected, (state, action) => {
        state.error = action.payload;
      });
  },
});

export const { reorderRecipes } = savedRecipesSlice.actions;
export default savedRecipesSlice.reducer;
