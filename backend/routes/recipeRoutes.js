const express = require("express");
const {
  searchRecipe,
  saveRecipe,
  getSavedRecipes,
  getAllRecipes,
  getRecipeById,
  updateSavedRecipesOrder,
  deleteSavedRecipe,
} = require("../controllers/recipeController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", getAllRecipes);
router.get("/search", searchRecipe);
router.get("/saved", authMiddleware, getSavedRecipes);
router.delete("/saved/:recipeId", authMiddleware, deleteSavedRecipe);
router.put("/saved/order", authMiddleware, updateSavedRecipesOrder);

router.post("/save", authMiddleware, saveRecipe);
router.get("/:id", getRecipeById);

module.exports = router;
