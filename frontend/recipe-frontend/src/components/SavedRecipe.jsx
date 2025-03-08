import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import { fetchSavedRecipes } from "../features/savedRecipesSlice"; // Assuming this exists
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

const SavedRecipePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const {
    data: savedRecipes,
    status,
    error,
  } = useSelector((state) => state.savedRecipes);
  const { isAuthenticated } = useSelector((state) => state.auth);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchSavedRecipes());
    }
    setCurrentPage(1);
  }, [dispatch, isAuthenticated, location.pathname]);

  const totalPages = Math.ceil(savedRecipes.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentRecipes = savedRecipes.slice(startIndex, endIndex);

  const handleCardClick = (recipeId) => {
    navigate(`/recipe/${recipeId}`);
  };

  const handleDeleteRecipe = async (recipeId) => {
    try {
      const savedRecipeResponse = await axios.get(
        "https://recipe-website-arnr.onrender.com/api/recipes/saved",
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      const savedRecipe = savedRecipeResponse.data.find(
        (r) => r.recipeId === recipeId,
      );
      if (!savedRecipe) throw new Error("Saved recipe not found");

      await axios.delete(
        `https://recipe-website-arnr.onrender.com/api/recipes/saved/${savedRecipe._id}`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );

      dispatch(fetchSavedRecipes()); // Refresh saved recipes
      toast.success("Recipe removed from saved!");
    } catch (err) {
      console.error("Error deleting recipe:", err);
      toast.error(err.response?.data?.error || "Failed to delete recipe");
    }
  };

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
        Saved Recipes
      </Typography>

      <Grid container spacing={3} justifyContent="center">
        {status === "loading" ? (
          [...Array(itemsPerPage)].map((_, index) => (
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
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : currentRecipes.length > 0 ? (
          currentRecipes.map((recipe) => (
            <Grid item xs={6} sm={6} md={4} key={recipe.recipeId}>
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
                onClick={() => handleCardClick(recipe.recipeId)}
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
                  }}
                />
                <IconButton
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteRecipe(recipe.recipeId);
                  }}
                  sx={{
                    position: "absolute",
                    top: 8,
                    right: 8,
                    color: "#d32f2f",
                  }}
                >
                  <BookmarkIcon />
                </IconButton>
                <CardContent sx={{ paddingBottom: 2 }}>
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
                    sx={{ color: "#2c3e50", mt: 1 }}
                  >
                    {recipe.title}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    <AccessTimeIcon
                      fontSize="small"
                      sx={{ color: "#7f8c8d" }}
                    />
                    <Typography variant="body2" sx={{ color: "#7f8c8d" }}>
                      {recipe.readyInMinutes} MINUTES
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))
        ) : (
          <Typography variant="body1" sx={{ textAlign: "center", mt: 4 }}>
            No saved recipes found.
          </Typography>
        )}
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
            onClick={() => dispatch(fetchSavedRecipes())}
          >
            Retry
          </button>
        </Box>
      )}

      {totalPages > 1 && (
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
      )}
    </Box>
  );
};

export default SavedRecipePage;
