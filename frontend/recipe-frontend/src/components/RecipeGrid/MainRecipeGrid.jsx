import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchRecipes } from "../../features/recipesSlice";
import {
  fetchSavedRecipes,
  saveRecipe,
  deleteRecipe,
} from "../../features/savedRecipesSlice";
import { Box, Grid, Typography } from "@mui/material";
import RestaurantMenuIcon from "@mui/icons-material/RestaurantMenu";
import { toast } from "react-toastify";
import FilterSection from "./FilterSection";
import RecipeCardItem from "./RecipeCardItem";
import LoadingSkeleton from "./LoadingSkeleton";
import ErrorState from "./ErrorState";
import PaginationSection from "./PaginationSection";

const RecipeGrid = ({ searchQuery, isLoading }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    data: recipes,
    status,
    error,
  } = useSelector((state) => state.recipes);
  const { data: savedRecipesData } = useSelector((state) => state.savedRecipes);
  const { isAuthenticated = false } = useSelector((state) => state.auth || {});
  const [currentPage, setCurrentPage] = useState(1);
  const [dietFilter, setDietFilter] = useState("all");
  const [timeSort, setTimeSort] = useState("none");
  const [ratingSort, setRatingSort] = useState("none");
  const itemsPerPage = 9;

  const savedRecipes = savedRecipesData.map((recipe) => recipe.recipeId);

  useEffect(() => {
    if (!isLoading) {
      dispatch(fetchRecipes());
      if (isAuthenticated) dispatch(fetchSavedRecipes());
    }
    setCurrentPage(1);
  }, [dispatch, isAuthenticated, searchQuery, location.pathname, isLoading]);

  const filteredRecipes = recipes
    .filter(
      (recipe) =>
        recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        recipe.summary.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    .filter((recipe) => {
      if (dietFilter === "vegetarian") return recipe.vegan;
      if (dietFilter === "non-vegetarian") return !recipe.vegan;
      return true;
    })
    .sort((a, b) => {
      if (ratingSort === "desc")
        return (b.aggregateLikes || 0) - (a.aggregateLikes || 0);
      if (ratingSort === "asc")
        return (a.aggregateLikes || 0) - (b.aggregateLikes || 0);
      if (timeSort === "asc") return a.readyInMinutes - b.readyInMinutes;
      if (timeSort === "desc") return b.readyInMinutes - a.readyInMinutes;
      return 0;
    });

  const totalPages = Math.ceil(filteredRecipes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRecipes = filteredRecipes.slice(startIndex, endIndex);

  const handleCardClick = (recipeId) => navigate(`/recipe/${recipeId}`);

  const handleBookmarkClick = (recipeId) => {
    if (!isAuthenticated) return toast.error("Please sign in to save recipes!");
    savedRecipes.includes(recipeId)
      ? dispatch(
          deleteRecipe(
            savedRecipesData.find((r) => r.recipeId === recipeId)._id,
          ),
        )
          .unwrap()
          .then(() => toast.success("Recipe removed!"))
          .catch((err) => toast.error(err || "Failed to remove recipe"))
      : dispatch(
          saveRecipe({
            recipeId,
            title: recipes.find((r) => r.id === recipeId).title,
            image: recipes.find((r) => r.id === recipeId).image,
            vegan: recipes.find((r) => r.id === recipeId).vegan,
            readyInMinutes: recipes.find((r) => r.id === recipeId)
              .readyInMinutes,
          }),
        )
          .unwrap()
          .then(() => toast.success("Recipe saved!"))
          .catch((err) => toast.error(err || "Failed to save recipe"));
  };

  const combinedLoading = isLoading || status === "loading";

  return (
    <Box
      sx={{
        padding: { xs: 2, md: 5 },
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h3"
        sx={{
          fontFamily: "Poppins, sans-serif",
          fontWeight: 700,
          color: "#3a5f3b",
          textAlign: "center",
          mb: 4,
          textShadow: "1px 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        {searchQuery ? `"${searchQuery}"` : "Savor the Flavors 🍲"}
      </Typography>

      <FilterSection
        dietFilter={dietFilter}
        setDietFilter={setDietFilter}
        timeSort={timeSort}
        setTimeSort={setTimeSort}
        ratingSort={ratingSort}
        setRatingSort={setRatingSort}
        setCurrentPage={setCurrentPage}
      />

      <Grid container spacing={{ xs: 2, md: 4 }}>
        {combinedLoading ? (
          <LoadingSkeleton itemsPerPage={itemsPerPage} />
        ) : status === "failed" ? (
          <ErrorState
            error={error}
            retryAction={() => dispatch(fetchRecipes())}
          />
        ) : currentRecipes.length === 0 ? (
          <Box sx={{ width: "100%", textAlign: "center", py: 4 }}>
            <RestaurantMenuIcon sx={{ fontSize: 60, color: "#6b7280" }} />
            <Typography sx={{ mt: 2, color: "#6b7280" }}>
              No recipes found!
            </Typography>
          </Box>
        ) : (
          currentRecipes.map((recipe) => (
            <Grid item xs={12} sm={6} md={4} key={recipe.id}>
              <RecipeCardItem
                recipe={recipe}
                savedRecipes={savedRecipes}
                handleCardClick={handleCardClick}
                handleBookmarkClick={handleBookmarkClick}
              />
            </Grid>
          ))
        )}
      </Grid>

      {totalPages > 1 && !combinedLoading && status !== "failed" && (
        <PaginationSection
          totalPages={totalPages}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
        />
      )}
    </Box>
  );
};

export default RecipeGrid;
