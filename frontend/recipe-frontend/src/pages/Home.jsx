import React from "react";
import RecipeGrid from "../components/RecipeGrid/MainRecipeGrid";
import { Box, Container } from "@mui/material";

const Home = ({ searchQuery }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <Container sx={{ width: "85%", py: 2 }}>
          <RecipeGrid searchQuery={searchQuery} />
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
