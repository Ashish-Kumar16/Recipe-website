import React from "react";
import { Box, Typography, Grid, Checkbox, IconButton } from "@mui/material";
import { SectionTitle } from "./RecipeDetailStyles";

const IngredientsSection = ({
  recipeDetail,
  isMobile,
  servings,
  checkedIngredients,
  handleServingsChange,
  handleIngredientToggle,
  scaleIngredient,
}) => (
  <Box mt={isMobile ? 3 : 5}>
    <SectionTitle variant={isMobile ? "h6" : "h5"}>Ingredients</SectionTitle>
    <Box display="flex" alignItems="center" gap={2} mb={2}>
      <Typography sx={{ color: "#6b7280" }}>Servings:</Typography>
      <Box
        display="flex"
        alignItems="center"
        bgcolor="#fff"
        borderRadius={4}
        p={0.5}
        boxShadow={1}
      >
        <IconButton
          onClick={() => handleServingsChange(-1)}
          disabled={servings <= 1}
          size="small"
        >
          <Typography sx={{ color: "#3a5f3b" }}>-</Typography>
        </IconButton>
        <Typography
          sx={{ px: 2, color: "#2f2f2f", minWidth: 30, textAlign: "center" }}
        >
          {servings}
        </Typography>
        <IconButton onClick={() => handleServingsChange(1)} size="small">
          <Typography sx={{ color: "#3a5f3b" }}>+</Typography>
        </IconButton>
      </Box>
    </Box>
    <Grid container spacing={isMobile ? 1 : 2}>
      {recipeDetail.extendedIngredients.map((ingredient) => (
        <Grid item xs={12} sm={6} key={ingredient.id}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              p: 1,
              borderRadius: 2,
              bgcolor: checkedIngredients[ingredient.id] ? "#f0f4f0" : "#fff",
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
              transition: "all 0.2s ease",
              "&:hover": { bgcolor: "#fafafa", transform: "translateX(2px)" },
            }}
          >
            <Checkbox
              checked={checkedIngredients[ingredient.id] || false}
              onChange={() => handleIngredientToggle(ingredient.id)}
              sx={{ color: "#3a5f3b", "&.Mui-checked": { color: "#ff7043" } }}
            />
            <Typography
              sx={{
                color: "#2f2f2f",
                fontSize: isMobile ? "0.9rem" : "1rem",
                textDecoration: checkedIngredients[ingredient.id]
                  ? "line-through"
                  : "none",
              }}
            >
              {ingredient.measures.us.amount
                ? `${scaleIngredient(ingredient.measures.us.amount).toFixed(
                    2,
                  )} ${ingredient.measures.us.unitShort} ${
                    ingredient.nameClean
                  }`
                : ingredient.original}
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  </Box>
);

export default IngredientsSection;
