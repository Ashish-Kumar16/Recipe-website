import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchRecipes } from "../features/recipesSlice";
import {
  fetchSavedRecipes,
  saveRecipe,
  deleteRecipe,
} from "../features/savedRecipesSlice";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Skeleton,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Button,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { toast } from "react-toastify";

const RecipeGrid = ({ searchQuery }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    data: recipes,
    status,
    error,
  } = useSelector((state) => state.recipes);
  const { data: savedRecipesData, status: savedStatus } = useSelector(
    (state) => state.savedRecipes,
  );
  const { isAuthenticated = false } = useSelector((state) => state.auth || {});
  const [currentPage, setCurrentPage] = useState(1);
  const [dietFilter, setDietFilter] = useState("all");
  const [timeSort, setTimeSort] = useState("none");
  const [ratingSort, setRatingSort] = useState("none");
  const itemsPerPage = 9;

  // Derive savedRecipes from Redux state
  const savedRecipes = savedRecipesData.map((recipe) => recipe.recipeId);

  useEffect(() => {
    dispatch(fetchRecipes());
    if (isAuthenticated) {
      dispatch(fetchSavedRecipes());
    }
    setCurrentPage(1);
  }, [dispatch, isAuthenticated, searchQuery, location.pathname]);

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
      // Sort by rating (aggregateLikes)
      if (ratingSort === "desc") {
        return (b.aggregateLikes || 0) - (a.aggregateLikes || 0);
      } else if (ratingSort === "asc") {
        return (a.aggregateLikes || 0) - (b.aggregateLikes || 0);
      }

      // Sort by time (readyInMinutes)
      if (timeSort === "asc") {
        return a.readyInMinutes - b.readyInMinutes;
      } else if (timeSort === "desc") {
        return b.readyInMinutes - a.readyInMinutes;
      }

      return 0; // Default: no sorting
    });

  const totalPages = Math.ceil(filteredRecipes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRecipes = filteredRecipes.slice(startIndex, endIndex);

  const handleCardClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  const handleSaveRecipe = async (recipeId) => {
    try {
      const recipe = recipes.find((r) => r.id === recipeId);
      if (!recipe) throw new Error("Recipe not found");

      const recipeData = {
        recipeId: recipe.id,
        title: recipe.title,
        image: recipe.image,
        vegan: recipe.vegan,
        readyInMinutes: recipe.readyInMinutes,
      };

      const result = await dispatch(saveRecipe(recipeData)).unwrap();
      toast.success(result.message || "Recipe saved!");
    } catch (err) {
      console.error("Error saving recipe:", err);
      toast.error(err || "Failed to save recipe");
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    try {
      const savedRecipe = savedRecipesData.find((r) => r.recipeId === recipeId);
      if (!savedRecipe) throw new Error("Saved recipe not found");

      await dispatch(deleteRecipe(savedRecipe._id)).unwrap();
      toast.success("Recipe removed from saved!");
    } catch (err) {
      console.error("Error deleting recipe:", err);
      toast.error(err || "Failed to delete recipe");
    }
  };

  const handleBookmarkClick = (recipeId) => {
    if (!isAuthenticated) {
      toast.error("Please sign in to save recipes!");
      return;
    }
    if (savedRecipes.includes(recipeId)) {
      handleDeleteRecipe(recipeId);
    } else {
      handleSaveRecipe(recipeId);
    }
  };

  const handleDietFilterChange = (event) => {
    setDietFilter(event.target.value);
    setCurrentPage(1);
  };

  const handleTimeSortChange = (event) => {
    setTimeSort(event.target.value);
    setRatingSort("none"); // Reset rating sort
    setCurrentPage(1);
  };

  const handleRatingSortChange = (event) => {
    setRatingSort(event.target.value);
    setTimeSort("none"); // Reset time sort
    setCurrentPage(1);
  };

  return (
    <Box
      sx={{
        padding: { xs: 2, sm: 4 },
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          color: "#2c3e50",
          mb: { xs: 2, sm: 3 },
          fontSize: { xs: "1.5rem", sm: "2rem" },
        }}
      >
        {searchQuery
          ? `Search Results for "${searchQuery}"`
          : "🍽️ Explore Delicious Recipes"}
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
          gap: 2,
        }}
      >
        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="diet-filter-label">Diet</InputLabel>
          <Select
            labelId="diet-filter-label"
            value={dietFilter}
            label="Diet"
            onChange={handleDietFilterChange}
          >
            <MenuItem value="all">All</MenuItem>
            <MenuItem value="vegetarian">Vegetarian</MenuItem>
            <MenuItem value="non-vegetarian">Non-Vegetarian</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="time-sort-label">Sort by Time</InputLabel>
          <Select
            labelId="time-sort-label"
            value={timeSort}
            label="Sort by Time"
            onChange={handleTimeSortChange}
          >
            <MenuItem value="none">None</MenuItem>
            <MenuItem value="asc">Fastest First</MenuItem>
            <MenuItem value="desc">Slowest First</MenuItem>
          </Select>
        </FormControl>

        <FormControl sx={{ minWidth: 150 }}>
          <InputLabel id="rating-sort-label">Sort by Rating</InputLabel>
          <Select
            labelId="rating-sort-label"
            value={ratingSort}
            label="Sort by Rating"
            onChange={handleRatingSortChange}
          >
            <MenuItem value="none">None</MenuItem>
            <MenuItem value="desc">Highest First</MenuItem>
            <MenuItem value="asc">Lowest First</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={{ xs: 2, sm: 3 }} justifyContent="center">
        {status === "loading" ? (
          [...Array(itemsPerPage)].map((_, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card sx={{ borderRadius: 2, boxShadow: 2, height: "100%" }}>
                <Skeleton variant="rectangular" height={150} />
                <CardContent>
                  <Skeleton variant="text" width={100} height={25} />
                  <Skeleton variant="text" width="90%" height={20} />
                  <Box display="flex" alignItems="center" gap={1} mt={1}>
                    <Skeleton variant="circular" width={20} height={20} />
                    <Skeleton variant="text" width={50} />
                  </Box>
                  <Box display="flex" alignItems="center" gap={1}>
                    <Skeleton variant="circular" width={20} height={20} />
                    <Skeleton variant="text" width={50} />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : currentRecipes.length > 0 ? (
          currentRecipes.map((recipe) => (
            <Grid item xs={12} sm={6} md={4} key={recipe.id}>
              <Card
                sx={{
                  borderRadius: 3,
                  boxShadow: 3,
                  transition: {
                    sm: "transform 0.3s ease-in-out, box-shadow 0.3s",
                  },
                  "&:hover": { sm: { transform: "scale(1.03)", boxShadow: 5 } },
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  cursor: "pointer",
                }}
                onClick={() => handleCardClick(recipe.id)}
              >
                <CardMedia
                  component="img"
                  height={{ xs: 150, sm: 200 }}
                  image={recipe.image}
                  alt={recipe.title}
                  sx={{
                    borderTopLeftRadius: 3,
                    borderTopRightRadius: 3,
                    objectFit: "cover",
                    flexShrink: 0,
                  }}
                />
                <CardContent
                  sx={{
                    padding: { xs: 1.5, sm: 2 },
                    flexGrow: 1,
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                >
                  <Box
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        textTransform: "uppercase",
                        fontWeight: "bold",
                        letterSpacing: 1,
                        color: recipe.vegan ? "#4caf50" : "#d32f2f",
                        fontSize: { xs: "0.7rem", sm: "0.75rem" },
                      }}
                    >
                      {recipe.vegan ? "Vegetarian" : "Non-Vegetarian"}
                    </Typography>
                    <IconButton
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookmarkClick(recipe.id);
                      }}
                      sx={{
                        color: savedRecipes.includes(recipe.id)
                          ? "#d32f2f"
                          : "grey",
                        padding: { xs: "4px", sm: "6px" },
                      }}
                    >
                      <BookmarkIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Typography
                    variant="h6"
                    fontWeight="bold"
                    sx={{
                      color: "#2c3e50",
                      mt: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                      fontSize: { xs: "1rem", sm: "1.25rem" },
                    }}
                  >
                    {recipe.title}
                  </Typography>
                  <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="space-between"
                    mt={1}
                  >
                    <Box display="flex" alignItems="center" gap={1}>
                      <AccessTimeIcon
                        fontSize="small"
                        sx={{ color: "#7f8c8d" }}
                      />
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#7f8c8d",
                          fontSize: { xs: "0.8rem", sm: "0.875rem" },
                        }}
                      >
                        {recipe.readyInMinutes} MIN
                      </Typography>
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <ThumbUpIcon fontSize="small" sx={{ color: "#7f8c8d" }} />
                      <Typography
                        variant="body2"
                        sx={{
                          color: "#7f8c8d",
                          fontSize: { xs: "0.8rem", sm: "0.875rem" },
                        }}
                      >
                        {recipe.aggregateLikes || 0} LIKES
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography
            variant="body1"
            sx={{
              textAlign: "center",
              mt: 4,
              fontSize: { xs: "1rem", sm: "1.125rem" },
            }}
          >
            No recipes found.
          </Typography>
        )}
      </Grid>

      {status === "failed" && (
        <Box textAlign="center" mt={5}>
          <Typography
            color="error"
            sx={{ fontSize: { xs: "1rem", sm: "1.2rem" } }}
          >
            ⚠️{" "}
            {typeof error === "string"
              ? error
              : error?.error || "An error occurred"}
          </Typography>
          <Button
            style={{
              padding: "8px 16px",
              marginTop: "10px",
              backgroundColor: "#ff6f61",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "0.9rem",
            }}
            onClick={() => dispatch(fetchRecipes())}
          >
            Retry
          </Button>
        </Box>
      )}

      {totalPages > 1 && (
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          mt={4}
          gap={2}
        >
          <Button
            style={{
              padding: "10px 20px",
              border: "none",
              backgroundColor: "#ff6f61",
              color: "white",
              fontSize: "1rem",
              borderRadius: "5px",
              cursor: "pointer",
              opacity: currentPage === 1 ? 0.6 : 1,
              minWidth: "100px",
            }}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <Typography
            variant="h6"
            sx={{ fontSize: { xs: "1rem", sm: "1.25rem" } }}
          >
            {currentPage} / {totalPages}
          </Typography>
          <Button
            style={{
              padding: "10px 20px",
              border: "none",
              backgroundColor: "#ff6f61",
              color: "white",
              fontSize: "1rem",
              borderRadius: "5px",
              cursor: "pointer",
              opacity: currentPage === totalPages ? 0.6 : 1,
              minWidth: "100px",
            }}
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default RecipeGrid;
