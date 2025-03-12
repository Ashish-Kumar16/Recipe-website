import React from "react";
import { Box, Typography, Grid, LinearProgress } from "@mui/material";
import { SectionTitle } from "./RecipeDetailStyles";

const NutritionSection = ({ recipeDetail, isMobile }) => (
  <Box mt={isMobile ? 3 : 5}>
    <SectionTitle variant={isMobile ? "h6" : "h5"}>Nutrition</SectionTitle>
    <Grid container spacing={isMobile ? 1 : 2}>
      {[
        {
          label: "Fat",
          value: recipeDetail.summary.match(/(\d+)g of fat/)?.[1] || "N/A",
        },
        {
          label: "Protein",
          value: recipeDetail.summary.match(/(\d+)g of protein/)?.[1] || "N/A",
        },
        {
          label: "Price/Serving",
          value: `$${recipeDetail.pricePerServing.toFixed(2)}`,
        },
        {
          label: "Calories",
          value: recipeDetail.summary.match(/(\d+) calories/)?.[1] || "N/A",
        },
      ].map((item, i) => (
        <Grid item xs={6} sm={3} key={i}>
          <Box sx={{ bgcolor: "#fff", p: 2, borderRadius: 2, boxShadow: 1 }}>
            <Typography
              sx={{ color: "#6b7280", fontSize: isMobile ? "0.9rem" : "1rem" }}
            >
              {item.value}
            </Typography>
            <Typography sx={{ fontWeight: 600, color: "#2f2f2f" }}>
              {item.label}
            </Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
    <Box mt={2}>
      <Typography sx={{ color: "#6b7280" }}>
        Health Score: {recipeDetail.healthScore}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={recipeDetail.healthScore}
        sx={{
          mt: 1,
          height: 10,
          borderRadius: 5,
          bgcolor: "#ddd",
          "& .MuiLinearProgress-bar": {
            background: "linear-gradient(45deg, #ff7043, #ffb300)",
          },
        }}
      />
    </Box>
  </Box>
);

export default NutritionSection;
