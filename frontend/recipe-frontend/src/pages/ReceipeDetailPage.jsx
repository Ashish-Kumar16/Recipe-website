import React from "react";
import RecipeDetail from "../components/RecipeDetail/MainRecipeDetail";
import { Box, Container } from "@mui/material";

const RecipeDetailPage = () => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <Container sx={{ width: "85%", py: 2 }}>
          <RecipeDetail />
        </Container>
      </Box>
    </Box>
  );
};

export default RecipeDetailPage;
