/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom";
import { fetchRecipeById } from "../../features/recipesSlice";
import {
  saveRecipe,
  deleteRecipe,
  fetchSavedRecipes,
} from "../../features/savedRecipesSlice";
import { Box, Skeleton, useMediaQuery } from "@mui/material";
import { toast } from "react-toastify";
import { useTheme } from "@mui/system";
import {
  RecipeContainer,
  GradientButton,
} from "./RecipeDetailStyles";
import RecipeHeader from "./RecipeHeader";
import IngredientsSection from "./IngredientsSection";
import NutritionSection from "./NutritionSection";
import DirectionsSection from "./DirectionsSection";
import DetailsSection from "./DetailsSection";
import BookmarkIcon from "@mui/icons-material/Bookmark";

const RecipeDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { recipeDetail, detailStatus, detailError } = useSelector(
    (state) => state.recipes,
  );
  const { data: savedRecipesData } = useSelector((state) => state.savedRecipes);
  const { isAuthenticated = false } = useSelector((state) => state.auth || {});
  const [servings, setServings] = useState(null);
  const [checkedIngredients, setCheckedIngredients] = useState({});

  const savedRecipes = savedRecipesData.map((recipe) => recipe.recipeId);
  const isRecipeSaved = savedRecipes.includes(Number(id));

  useEffect(() => {
    dispatch(fetchRecipeById(id));
    if (isAuthenticated) dispatch(fetchSavedRecipes());
  }, [dispatch, id, location.pathname, isAuthenticated]);

  useEffect(() => {
    if (recipeDetail) {
      setServings(recipeDetail.servings);
      const initialChecked = {};
      recipeDetail.extendedIngredients.forEach((ingredient) => {
        initialChecked[ingredient.id] = false;
      });
      setCheckedIngredients(initialChecked);
    }
  }, [recipeDetail]);

  const handleShare = async () => {
    try {
      if (navigator.share && isMobile) {
        await navigator.share({
          title: recipeDetail.title,
          text: `Check out this recipe: ${recipeDetail.title}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Recipe URL copied to clipboard!");
      }
    } catch (err) {
      toast.error("Failed to share recipe");
    }
  };

  const handlePrint = () => window.print();

  const handleServingsChange = (increment) => {
    setServings((prev) => Math.max(1, prev + increment));
  };

  const handleIngredientToggle = (ingredientId) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [ingredientId]: !prev[ingredientId],
    }));
  };

  const handleSaveToggle = async () => {
    if (!isAuthenticated) return toast.error("Please sign in to save recipes!");
    if (isRecipeSaved) {
      const savedRecipe = savedRecipesData.find(
        (r) => r.recipeId === Number(id),
      );
      if (!savedRecipe) return toast.error("Saved recipe not found");
      await dispatch(deleteRecipe(savedRecipe._id)).unwrap();
      toast.success("Recipe removed from saved!");
    } else {
      const recipeData = {
        recipeId: recipeDetail.id,
        title: recipeDetail.title,
        image: recipeDetail.image,
        vegan: recipeDetail.vegan,
        readyInMinutes: recipeDetail.readyInMinutes,
      };
      await dispatch(saveRecipe(recipeData)).unwrap();
      toast.success("Recipe saved!");
    }
  };

  const scaleIngredient = (amount) => {
    return (amount * servings) / recipeDetail.servings;
  };

  const renderSkeleton = () => (
    <Box sx={{ p: 2 }}>
      <Skeleton variant="text" width="60%" height={50} />
      <Skeleton
        variant="rectangular"
        height={300}
        sx={{ borderRadius: 4, mt: 2 }}
      />
      <Skeleton variant="text" width="40%" height={30} sx={{ mt: 2 }} />
      <Skeleton variant="text" width="80%" height={100} />
      {[...Array(5)].map((_, i) => (
        <Skeleton
          key={i}
          variant="text"
          width="90%"
          height={20}
          sx={{ mt: 1 }}
        />
      ))}
    </Box>
  );

  if (detailStatus === "loading") return renderSkeleton();
  if (detailStatus === "failed") {
    return (
      <Box textAlign="center" py={5} px={2}>
        <Typography variant="h6" sx={{ color: "#e74c3c", mb: 2 }}>
          ⚠️ {detailError}
        </Typography>
        <GradientButton onClick={() => dispatch(fetchRecipeById(id))}>
          Retry
        </GradientButton>
      </Box>
    );
  }
  if (!recipeDetail) return null;

  return (
    <RecipeContainer>
      <RecipeHeader
        recipeDetail={recipeDetail}
        isMobile={isMobile}
        isRecipeSaved={isRecipeSaved}
        handleShare={handleShare}
        handlePrint={handlePrint}
        handleSaveToggle={handleSaveToggle}
        servings={servings}
      />
      <IngredientsSection
        recipeDetail={recipeDetail}
        isMobile={isMobile}
        servings={servings}
        checkedIngredients={checkedIngredients}
        handleServingsChange={handleServingsChange}
        handleIngredientToggle={handleIngredientToggle}
        scaleIngredient={scaleIngredient}
      />
      <NutritionSection recipeDetail={recipeDetail} isMobile={isMobile} />
      <DirectionsSection recipeDetail={recipeDetail} isMobile={isMobile} />
      <DetailsSection recipeDetail={recipeDetail} isMobile={isMobile} />

      <Box
        display="flex"
        gap={2}
        mt={isMobile ? 3 : 5}
        justifyContent="center"
        flexWrap="wrap"
      >
        <GradientButton variant="contained" onClick={handlePrint}>
          Print Recipe
        </GradientButton>
        <GradientButton
          variant="contained"
          onClick={handleSaveToggle}
          startIcon={<BookmarkIcon />}
        >
          {isRecipeSaved ? "Saved" : "Save Recipe"}
        </GradientButton>
      </Box>
    </RecipeContainer>
  );
};

export default RecipeDetail;
