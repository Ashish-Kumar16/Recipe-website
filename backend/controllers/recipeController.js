const axios = require("axios");
const Recipe = require("../models/Recipe");
const User = require("../models/User");
const mongoose = require("mongoose");

const SPOONACULAR_API_BASE = "https://api.spoonacular.com/recipes";

// Array of API keys from environment variables
const API_KEYS = [
  process.env.SPOONACULAR_API_KEY_1,
  process.env.SPOONACULAR_API_KEY_2,
  process.env.SPOONACULAR_API_KEY_3,
].filter(Boolean); // Filter out undefined/null values

// Helper function to make API calls with fallback
const fetchFromSpoonacular = async (url) => {
  for (const apiKey of API_KEYS) {
    try {
      const response = await axios.get(`${url}&apiKey=${apiKey}`);
      return response.data; // Return data if successful
    } catch (error) {
      console.error(`API key ${apiKey} failed: ${error.message}`);
      if (error.response?.status === 402 || error.response?.status === 429) {
        // 402: Payment Required (quota exceeded), 429: Too Many Requests
        continue; // Try the next key
      }
      throw error; // Other errors (e.g., 404, 500) should stop the loop
    }
  }
  throw new Error("All API keys exhausted or failed");
};

// Get all random recipes
exports.getAllRecipes = async (req, res) => {
  try {
    if (API_KEYS.length === 0) {
      return res.status(500).json({ error: "No API keys configured" });
    }

    const data = await fetchFromSpoonacular(
      `${SPOONACULAR_API_BASE}/random?number=10`,
    );
    res.status(200).json(data.recipes);
  } catch (error) {
    console.error("Error fetching random recipes:", error.message);
    res.status(500).json({ error: "Failed to fetch recipes from Spoonacular" });
  }
};

// Get saved recipes (unchanged)
exports.getSavedRecipes = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const user = await User.findById(userId).populate("savedRecipes");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user.savedRecipes || []);
  } catch (error) {
    console.error("Error in getSavedRecipes:", error.stack);
    res
      .status(500)
      .json({ error: "Failed to fetch saved recipes", details: error.message });
  }
};

// Update saved recipes order (unchanged)
exports.updateSavedRecipesOrder = async (req, res) => {
  try {
    const { recipeIds } = req.body;
    if (!Array.isArray(recipeIds) || recipeIds.length === 0) {
      return res.status(400).json({ error: "Invalid recipe IDs" });
    }

    const userId = req.user.id || req.user._id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const user = await User.findById(userId).populate("savedRecipes");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const currentRecipeIds = user.savedRecipes.map((recipe) =>
      recipe._id.toString(),
    );
    if (!recipeIds.every((id) => currentRecipeIds.includes(id))) {
      return res.status(400).json({
        error: "One or more recipe IDs are invalid or not owned by user",
      });
    }

    user.savedRecipes = recipeIds.map((id) => new mongoose.Types.ObjectId(id));
    await user.save();

    const updatedUser = await User.findById(userId).populate("savedRecipes");
    res.status(200).json(updatedUser.savedRecipes);
  } catch (error) {
    console.error("Error updating recipe order:", error.stack);
    res
      .status(500)
      .json({ error: "Failed to update recipe order", details: error.message });
  }
};

// Search recipes
exports.searchRecipe = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ error: "Search query is required" });
    }
    if (API_KEYS.length === 0) {
      return res.status(500).json({ error: "No API keys configured" });
    }

    const data = await fetchFromSpoonacular(
      `${SPOONACULAR_API_BASE}/complexSearch?query=${encodeURIComponent(
        query,
      )}`,
    );
    res.status(200).json(data.results);
  } catch (error) {
    console.error("Error searching recipes:", error.message);
    res
      .status(400)
      .json({ error: error.message || "Failed to search recipes" });
  }
};

// Save recipe (unchanged)
exports.saveRecipe = async (req, res) => {
  try {
    const { recipeId, title, image, vegan, readyInMinutes } = req.body;
    if (
      !recipeId ||
      !title ||
      !image ||
      typeof vegan !== "boolean" ||
      !readyInMinutes
    ) {
      return res.status(400).json({ error: "All recipe fields are required" });
    }

    const user = await User.findById(req.user?.id);
    if (!user) return res.status(404).json({ error: "User not found" });

    const existingRecipe = await Recipe.findOne({
      recipeId,
      user: req.user.id,
    });
    if (existingRecipe) {
      return res.status(400).json({ error: "Recipe already saved" });
    }

    const newRecipe = new Recipe({
      recipeId,
      title,
      image,
      vegan,
      readyInMinutes,
      user: req.user.id,
    });
    await newRecipe.save();

    user.savedRecipes.push(newRecipe._id);
    await user.save();

    res.status(201).json({ message: "Recipe saved!", recipe: newRecipe });
  } catch (error) {
    console.error("Error saving recipe:", error.stack);
    res.status(400).json({ error: error.message || "Failed to save recipe" });
  }
};

// Get recipe by ID
exports.getRecipeById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: "Valid recipe ID is required" });
    }
    if (API_KEYS.length === 0) {
      return res.status(500).json({ error: "No API keys configured" });
    }

    const data = await fetchFromSpoonacular(
      `${SPOONACULAR_API_BASE}/${id}/information`,
    );
    res.status(200).json(data);
  } catch (error) {
    console.error("Error fetching recipe details:", error.message);
    if (error.response?.status === 404) {
      return res.status(404).json({ error: "Recipe not found" });
    }
    res.status(500).json({ error: "Failed to fetch recipe details" });
  }
};

// Delete saved recipe (unchanged)
exports.deleteSavedRecipe = async (req, res) => {
  try {
    const { recipeId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(recipeId)) {
      return res.status(400).json({ error: "Invalid recipe ID format" });
    }

    const userId = req.user.id || req.user._id;
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: "Invalid user ID format" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const recipeIndex = user.savedRecipes.findIndex(
      (id) => id.toString() === recipeId,
    );
    if (recipeIndex === -1) {
      return res
        .status(404)
        .json({ error: "Recipe not found in user's saved recipes" });
    }

    user.savedRecipes.splice(recipeIndex, 1);
    await user.save();

    const deletedRecipe = await Recipe.findByIdAndDelete(recipeId);
    if (!deletedRecipe) {
      return res.status(404).json({ error: "Recipe not found in database" });
    }

    res.status(200).json({ message: "Recipe deleted successfully" });
  } catch (error) {
    console.error("Error deleting saved recipe:", error.stack);
    res
      .status(500)
      .json({ error: "Failed to delete recipe", details: error.message });
  }
};

module.exports = exports;
