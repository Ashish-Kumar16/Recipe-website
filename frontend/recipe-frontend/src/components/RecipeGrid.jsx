import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchRecipes } from "../features/recipesSlice";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Skeleton,
  IconButton,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { toast } from "react-toastify";
import axios from "axios";

const RecipeGrid = ({ searchQuery }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    data: recipes,
    status,
    error,
  } = useSelector((state) => state.recipes);
  const { isAuthenticated = false } = useSelector((state) => state.auth || {});
  const [currentPage, setCurrentPage] = useState(1);
  const [savedRecipes, setSavedRecipes] = useState([]);
  const itemsPerPage = 9;

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchRecipes());
    }
    if (isAuthenticated) {
      fetchSavedRecipes();
    }
  }, [status, dispatch, isAuthenticated]);

  const fetchSavedRecipes = async () => {
    try {
      const response = await axios.get(
        "https://recipe-website-arnr.onrender.com/api/recipes/saved",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      setSavedRecipes(response.data.map((recipe) => recipe.recipeId));
    } catch (err) {
      console.error("Failed to fetch saved recipes:", err);
    }
  };

  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.summary.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      if (!recipe) {
        throw new Error("Recipe not found");
      }

      const recipeData = {
        recipeId: recipe.id,
        title: recipe.title,
        image: recipe.image,
        vegan: recipe.vegan,
        readyInMinutes: recipe.readyInMinutes,
      };

      const response = await axios.post(
        "https://recipe-website-arnr.onrender.com/api/recipes/save",
        recipeData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      setSavedRecipes((prev) => [...prev, recipe.id]);
      toast.success(response.data.message);
    } catch (err) {
      console.error("Error saving recipe:", err);
      toast.error(err.response?.data?.error || "Failed to save recipe");
    }
  };

  const handleDeleteRecipe = async (recipeId) => {
    try {
      const savedRecipeResponse = await axios.get(
        "https://recipe-website-arnr.onrender.com/api/recipes/saved",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );
      const savedRecipe = savedRecipeResponse.data.find(
        (r) => r.recipeId === recipeId
      );
      if (!savedRecipe) {
        throw new Error("Saved recipe not found");
      }

      await axios.delete(
        `https://recipe-website-arnr.onrender.com/api/recipes/saved/${savedRecipe._id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setSavedRecipes((prev) => prev.filter((id) => id !== recipeId));
      toast.success("Recipe removed from saved!");
    } catch (err) {
      console.error("Error deleting recipe:", err);
      toast.error(err.response?.data?.error || "Failed to delete recipe");
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

  // Debug mobile layout
  useEffect(() => {
    // console.log("Screen width:", window.innerWidth);
    // console.log("Current recipes:", currentRecipes.length);
  }, [currentRecipes]);

  return (
    <Box sx={{ padding: 4, backgroundColor: "#f8f9fa", minHeight: "100vh" }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{
          fontWeight: "bold",
          textAlign: "center",
          color: "#2c3e50",
          mb: 3,
        }}
      >
        🍽️ Explore Delicious Recipes
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {status === "loading"
          ? [...Array(itemsPerPage)].map((_, index) => (
              <Grid item xs={6} sm={6} md={4} key={index}>
                <Card sx={{ borderRadius: 2, boxShadow: 2, height: "100%" }}>
                  <Skeleton variant="rectangular" height={200} />
                  <CardContent>
                    <Skeleton variant="text" width={100} height={30} />
                    <Skeleton variant="text" width="90%" height={24} />
                    <Box display="flex" alignItems="center" gap={1} mt={1}>
                      <Skeleton variant="circular" width={22} height={22} />
                      <Skeleton variant="text" width={60} />
                    </Box>
                    <Box display="flex" alignItems="center" gap={1}>
                      <Skeleton variant="circular" width={22} height={22} />
                      <Skeleton variant="text" width={60} />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))
          : currentRecipes.map((recipe) => (
              <Grid item xs={6} sm={6} md={4} key={recipe.id}>
                <Card
                  sx={{
                    borderRadius: 3,
                    boxShadow: 3,
                    transition: "transform 0.3s ease-in-out, box-shadow 0.3s",
                    "&:hover": { transform: "scale(1.03)", boxShadow: 5 },
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    cursor: "pointer",
                    position: "relative",
                  }}
                  onClick={() => handleCardClick(recipe.id)}
                >
                  <CardMedia
                    component="img"
                    height="200"
                    image={recipe.image}
                    alt={recipe.title}
                    sx={{
                      borderTopLeftRadius: 3,
                      borderTopRightRadius: 3,
                      objectFit: "cover",
                      flexShrink: 0,
                    }}
                  />
                  <IconButton
                    onClick={(e) => {
                      e.stopPropagation();
                      handleBookmarkClick(recipe.id);
                    }}
                    sx={{
                      position: "absolute",
                      top: 8,
                      right: 8,
                      color: savedRecipes.includes(recipe.id)
                        ? "#d32f2f"
                        : "grey",
                    }}
                  >
                    <BookmarkIcon />
                  </IconButton>
                  <CardContent
                    sx={{
                      paddingBottom: 2,
                      flexGrow: 1,
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography
                      variant="caption"
                      sx={{
                        textTransform: "uppercase",
                        fontWeight: "bold",
                        letterSpacing: 1,
                        color: "#d32f2f",
                      }}
                    >
                      {recipe.vegan ? "Vegetarian" : "Non-Vegetarian"}
                    </Typography>
                    <Typography
                      variant="h6"
                      fontWeight="bold"
                      sx={{
                        color: "#2c3e50",
                        mt: 1,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
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
                        <Typography variant="body2" sx={{ color: "#7f8c8d" }}>
                          {recipe.readyInMinutes} MINUTES
                        </Typography>
                      </Box>
                      <Box display="flex" alignItems="center" gap={1}>
                        <ThumbUpIcon
                          fontSize="small"
                          sx={{ color: "#7f8c8d" }}
                        />
                        <Typography variant="body2" sx={{ color: "#7f8c8d" }}>
                          MEDIUM
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
      </Grid>

      {status === "failed" && (
        <Box textAlign="center" mt={5}>
          <Typography color="error" fontSize="1.2rem">
            ⚠️ {error}
          </Typography>
          <button
            style={{
              padding: "10px 20px",
              marginTop: "10px",
              backgroundColor: "#ff6f61",
              color: "white",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
            onClick={() => dispatch(fetchRecipes())}
          >
            Retry
          </button>
        </Box>
      )}

      <Box display="flex" justifyContent="center" mt={4}>
        <button
          style={{
            padding: "10px 20px",
            marginRight: "10px",
            border: "none",
            backgroundColor: "#ff6f61",
            color: "white",
            fontSize: "1rem",
            borderRadius: "5px",
            cursor: "pointer",
            opacity: currentPage === 1 ? 0.6 : 1,
          }}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          Previous
        </button>
        <Typography variant="h6" sx={{ alignSelf: "center" }}>
          Page {currentPage} of {totalPages}
        </Typography>
        <button
          style={{
            padding: "10px 20px",
            marginLeft: "10px",
            border: "none",
            backgroundColor: "#ff6f61",
            color: "white",
            fontSize: "1rem",
            borderRadius: "5px",
            cursor: "pointer",
            opacity: currentPage === totalPages ? 0.6 : 1,
          }}
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </Box>
    </Box>
  );
};

export default RecipeGrid;
