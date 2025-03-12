import React from "react";
import SavedRecipes from "../components/SavedRecipe";
import { Box, Container } from "@mui/material";

const SavedRecipesPage = () => {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#f8f9fa",
        minHeight: "100vh",
      }}
    >
      {/* Saved Recipes Content */}
      <Container
        sx={{
          width: "80%",
          maxWidth: "1200px",
          backgroundColor: "#fff",
          borderRadius: "12px",
          boxShadow: "0px 4px 10px rgba(0,0,0,0.1)",
          padding: "20px",
          marginY: "20px",
        }}
      >
        <SavedRecipes />
      </Container>
    </Box>
  );
};

export default SavedRecipesPage;
