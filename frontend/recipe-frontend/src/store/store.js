import { configureStore } from "@reduxjs/toolkit";
import recipeReducer from "../features/recipesSlice";
import authReducer from "../features/authSlice";
import savedRecipesReducer from "../features/savedRecipesSlice";

const store = configureStore({
  reducer: {
    recipes: recipeReducer,
    auth: authReducer,
    savedRecipes: savedRecipesReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializability check
    }),
});

export default store;
