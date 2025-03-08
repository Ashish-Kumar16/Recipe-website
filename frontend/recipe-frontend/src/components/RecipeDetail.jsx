import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams, useLocation } from "react-router-dom"; // Add useLocation
import { fetchRecipeById } from "../features/recipesSlice";
import {
  Box,
  Typography,
  Card,
  CardMedia,
  Divider,
  Skeleton,
  Checkbox,
  Grid,
  Button,
  IconButton,
} from "@mui/material";
import ShareIcon from "@mui/icons-material/Share";
import PrintIcon from "@mui/icons-material/Print";
import StarIcon from "@mui/icons-material/Star";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleIcon from "@mui/icons-material/People";
import RestaurantIcon from "@mui/icons-material/Restaurant";

const RecipeDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const location = useLocation(); // Track route changes
  const { recipeDetail, detailStatus, detailError } = useSelector(
    (state) => state.recipes,
  ); // Use recipeDetail instead of recipe
  const [servings, setServings] = useState(null);
  const [checkedIngredients, setCheckedIngredients] = useState({});

  useEffect(() => {
    // Fetch recipe whenever id or pathname changes
    dispatch(fetchRecipeById(id));
  }, [dispatch, id, location.pathname]); // Depend on id and pathname

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
      if (navigator.share) {
        await navigator.share({
          title: recipeDetail.title,
          text: `Check out this recipe: ${recipeDetail.title}`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Recipe URL copied to clipboard!");
      }
    } catch (err) {
      console.error("Error sharing:", err);
      alert("Failed to share recipe");
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleIngredientToggle = (ingredientId) => {
    setCheckedIngredients((prev) => ({
      ...prev,
      [ingredientId]: !prev[ingredientId],
    }));
  };

  const renderSkeleton = () => (
    <Box
      sx={{ padding: { xs: 2, sm: 3, md: 4 }, maxWidth: "900px", mx: "auto" }}
    >
      <Skeleton variant="text" width="60%" height={50} sx={{ mb: 1 }} />
      <Box display="flex" alignItems="center" gap={1} mb={2} flexWrap="wrap">
        <Skeleton variant="circular" width={40} height={40} />
        <Skeleton variant="text" width={100} />
        <Skeleton variant="text" width={100} />
      </Box>
      <Skeleton
        variant="rectangular"
        height={{ xs: 200, sm: 300, md: 400 }}
        sx={{ borderRadius: 2 }}
      />
      <Box display="flex" gap={1} mt={2} flexWrap="wrap">
        <Skeleton variant="text" width={100} />
        <Skeleton variant="text" width={100} />
        <Skeleton variant="text" width={100} />
      </Box>
      <Skeleton variant="text" width="40%" height={40} sx={{ mt: 3 }} />
      <Skeleton variant="text" width="80%" height={100} sx={{ mt: 1 }} />
      <Skeleton variant="text" width="40%" height={40} sx={{ mt: 3 }} />
      {[...Array(5)].map((_, index) => (
        <Box key={index} display="flex" alignItems="center" gap={1} mt={1}>
          <Skeleton variant="circular" width={20} height={20} />
          <Skeleton variant="text" width="90%" />
        </Box>
      ))}
    </Box>
  );

  if (detailStatus === "loading") return renderSkeleton();

  if (detailStatus === "failed") {
    return (
      <Box textAlign="center" mt={5} px={2}>
        <Typography color="error" fontSize={{ xs: "1rem", sm: "1.2rem" }}>
          ⚠️ {detailError}
        </Typography>
        <Button
          variant="contained"
          sx={{ mt: 2, backgroundColor: "#ff6f61" }}
          onClick={() => dispatch(fetchRecipeById(id))}
        >
          Retry
        </Button>
      </Box>
    );
  }

  if (!recipeDetail) return null;

  const proteinMatch = recipeDetail.summary.match(/(\d+)g of protein/);
  const fatMatch = recipeDetail.summary.match(/(\d+)g of fat/);
  const caloriesMatch = recipeDetail.summary.match(/(\d+) calories/);

  return (
    <Box
      sx={{ padding: { xs: 2, sm: 3, md: 4 }, maxWidth: "900px", mx: "auto" }}
    >
      <Typography
        variant="h4"
        sx={{
          fontWeight: "bold",
          color: "#2c3e50",
          mb: 1,
          fontSize: { xs: "1.5rem", sm: "2rem", md: "2.5rem" },
        }}
      >
        {recipeDetail.title}
      </Typography>
      <Box
        display="flex"
        alignItems="center"
        gap={2}
        mb={2}
        flexWrap="wrap"
        justifyContent={{ xs: "center", sm: "flex-start" }}
      >
        <Box display="flex" alignItems="center">
          <img
            src="https://via.placeholder.com/40"
            alt="Author"
            style={{ borderRadius: "50%", width: 40, height: 40 }}
          />
          <Typography variant="body2" sx={{ ml: 1, color: "#7f8c8d" }}>
            {recipeDetail.creditsText || "Unknown Author"}
          </Typography>
        </Box>
        <Typography variant="body2" sx={{ color: "#7f8c8d" }}>
          {new Date().toLocaleDateString()}
        </Typography>
        <Box display="flex" gap={1}>
          <IconButton onClick={handleShare} title="Share Recipe">
            <ShareIcon sx={{ color: "#7f8c8d" }} />
          </IconButton>
          <IconButton onClick={handlePrint} title="Print Recipe">
            <PrintIcon sx={{ color: "#7f8c8d" }} />
          </IconButton>
        </Box>
      </Box>

      <Card sx={{ borderRadius: 2, boxShadow: 2 }}>
        <CardMedia
          component="img"
          image={recipeDetail.image}
          alt={recipeDetail.title}
          sx={{ height: { xs: 200, sm: 300, md: 400 }, objectFit: "cover" }}
          onError={(e) => {
            e.target.src =
              "https://via.placeholder.com/400x400?text=Image+Not+Found";
          }}
        />
      </Card>

      <Box display="flex" gap={2} mt={2} flexWrap="wrap">
        <Box display="flex" alignItems="center" gap={1}>
          <AccessTimeIcon sx={{ color: "#7f8c8d" }} />
          <Typography variant="body2" sx={{ color: "#7f8c8d" }}>
            {recipeDetail.readyInMinutes} MINUTES
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <PeopleIcon sx={{ color: "#7f8c8d" }} />
          <Typography variant="body2" sx={{ color: "#7f8c8d" }}>
            {servings} SERVINGS
          </Typography>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <RestaurantIcon sx={{ color: "#7f8c8d" }} />
          <Typography variant="body2" sx={{ color: "#7f8c8d" }}>
            {recipeDetail.vegetarian ? "VEGETARIAN" : "NON-VEGETARIAN"}
          </Typography>
        </Box>
      </Box>

      <Typography
        variant="body1"
        sx={{
          mt: 2,
          color: "#7f8c8d",
          lineHeight: 1.6,
          fontSize: { xs: "0.9rem", sm: "1rem" },
        }}
        dangerouslySetInnerHTML={{ __html: recipeDetail.summary }}
      />

      <Box display="flex" alignItems="center" mt={2}>
        <Typography variant="body2" sx={{ mr: 1, color: "#7f8c8d" }}>
          Rating ({recipeDetail.aggregateLikes || 0})
        </Typography>
        {[...Array(5)].map((_, index) => (
          <StarIcon
            key={index}
            sx={{
              color:
                index < Math.round(recipeDetail.spoonacularScore / 20)
                  ? "#ff6f61"
                  : "#ddd",
              fontSize: { xs: 16, sm: 18 },
            }}
          />
        ))}
      </Box>

      <Divider sx={{ my: 3 }} />

      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          color: "#2c3e50",
          mb: 2,
          fontSize: { xs: "1.25rem", sm: "1.5rem" },
        }}
      >
        Ingredients:
      </Typography>
      <Box display="flex" alignItems="center" mb={2} flexWrap="wrap" gap={2}>
        <Typography variant="body2" sx={{ mr: 2 }}>
          Adjust Servings
        </Typography>
        <Box
          sx={{
            border: "1px solid #ddd",
            borderRadius: 1,
            padding: "2px 8px",
            width: 60,
            textAlign: "center",
          }}
        >
          {servings}
        </Box>
      </Box>
      <Grid container spacing={2}>
        {recipeDetail.extendedIngredients.map((ingredient) => (
          <Grid item xs={12} sm={6} md={4} key={ingredient.id}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                padding: 1,
                border: "1px solid #ddd",
                borderRadius: 1,
                backgroundColor: checkedIngredients[ingredient.id]
                  ? "#f5f5f5"
                  : "white",
                transition: "background-color 0.2s",
                "&:hover": { backgroundColor: "#fafafa" },
              }}
            >
              <Checkbox
                checked={checkedIngredients[ingredient.id] || false}
                onChange={() => handleIngredientToggle(ingredient.id)}
                sx={{ color: "#7f8c8d", "&.Mui-checked": { color: "#ff6f61" } }}
              />
              <Typography
                variant="body2"
                sx={{
                  color: "#2c3e50",
                  textDecoration: checkedIngredients[ingredient.id]
                    ? "line-through"
                    : "none",
                  flexGrow: 1,
                  fontSize: { xs: "0.85rem", sm: "0.9rem" },
                }}
              >
                {ingredient.measures.us.amount &&
                ingredient.measures.us.unitShort
                  ? `${ingredient.measures.us.amount} ${ingredient.measures.us.unitShort} ${ingredient.nameClean}`
                  : ingredient.original}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          color: "#2c3e50",
          mb: 2,
          fontSize: { xs: "1.25rem", sm: "1.5rem" },
        }}
      >
        Nutritional Information
      </Typography>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={6} sm={3}>
          <Typography variant="body2" sx={{ color: "#7f8c8d" }}>
            {fatMatch ? fatMatch[1] + "g" : "N/A"}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Fat
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="body2" sx={{ color: "#7f8c8d" }}>
            {proteinMatch ? proteinMatch[1] + "g" : "N/A"}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Protein
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="body2" sx={{ color: "#7f8c8d" }}>
            {recipeDetail.pricePerServing
              ? `$${recipeDetail.pricePerServing.toFixed(2)}`
              : "N/A"}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Price/Serving
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="body2" sx={{ color: "#7f8c8d" }}>
            {caloriesMatch ? caloriesMatch[1] : "N/A"}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Calories
          </Typography>
        </Grid>
        <Grid item xs={6} sm={3}>
          <Typography variant="body2" sx={{ color: "#7f8c8d" }}>
            {recipeDetail.healthScore || "N/A"}
          </Typography>
          <Typography variant="body1" sx={{ fontWeight: "bold" }}>
            Health Score
          </Typography>
        </Grid>
      </Grid>

      <Divider sx={{ my: 3 }} />

      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          color: "#2c3e50",
          mb: 2,
          fontSize: { xs: "1.25rem", sm: "1.5rem" },
        }}
      >
        Directions
      </Typography>
      {recipeDetail.analyzedInstructions[0]?.steps.map((step, index) => (
        <Box key={index} mb={3}>
          <Box display="flex" alignItems="flex-start" gap={2}>
            <Box
              sx={{
                width: { xs: 25, sm: 30 },
                height: { xs: 25, sm: 30 },
                backgroundColor: "#ff6f61",
                color: "white",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                flexShrink: 0,
              }}
            >
              {step.number}
            </Box>
            <Typography
              variant="body1"
              sx={{ color: "#2c3e50", fontSize: { xs: "0.9rem", sm: "1rem" } }}
            >
              {step.step}
            </Typography>
          </Box>

          {step.equipment && step.equipment.length > 0 && (
            <Box sx={{ mt: 2 }}>
              <Typography variant="body2" sx={{ color: "#7f8c8d", mb: 1 }}>
                Equipment Needed:
              </Typography>
              <Box display="flex" gap={2} flexWrap="wrap">
                {step.equipment.map((equip, equipIndex) => (
                  <Box
                    key={equipIndex}
                    sx={{
                      textAlign: "center",
                      maxWidth: { xs: "80px", sm: "100px" },
                    }}
                  >
                    <img
                      src={equip.image}
                      alt={equip.name}
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/100x100?text=Image+Not+Found";
                      }}
                      style={{
                        width: "100%",
                        height: "auto",
                        objectFit: "cover",
                        borderRadius: "8px",
                      }}
                    />
                    <Typography
                      variant="caption"
                      sx={{ color: "#7f8c8d", mt: 1, display: "block" }}
                    >
                      {equip.name}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          )}
        </Box>
      ))}

      <Divider sx={{ my: 3 }} />

      <Box>
        <Typography
          variant="h6"
          sx={{
            fontWeight: "bold",
            color: "#2c3e50",
            mb: 1,
            fontSize: { xs: "1.1rem", sm: "1.25rem" },
          }}
        >
          Dietary Information
        </Typography>
        <Typography
          variant="body2"
          sx={{ color: "#7f8c8d", fontSize: { xs: "0.85rem", sm: "0.9rem" } }}
        >
          {recipeDetail.diets.length > 0
            ? recipeDetail.diets.join(", ")
            : "No specific diet information available"}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            color: "#7f8c8d",
            mt: 1,
            fontSize: { xs: "0.85rem", sm: "0.9rem" },
          }}
        >
          Vegetarian: {recipeDetail.vegetarian ? "Yes" : "No"}
          <br />
          Vegan: {recipeDetail.vegan ? "Yes" : "No"}
          <br />
          Gluten Free: {recipeDetail.glutenFree ? "Yes" : "No"}
          <br />
          Dairy Free: {recipeDetail.dairyFree ? "Yes" : "No"}
        </Typography>
      </Box>

      <Box
        display="flex"
        gap={2}
        mt={3}
        justifyContent={{ xs: "center", sm: "flex-start" }}
      >
        <Button
          variant="contained"
          sx={{ backgroundColor: "#ff6f61", textTransform: "uppercase" }}
          onClick={handlePrint}
        >
          Print
        </Button>
      </Box>
    </Box>
  );
};

export default RecipeDetail;
