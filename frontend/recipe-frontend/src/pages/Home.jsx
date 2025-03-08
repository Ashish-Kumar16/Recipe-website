import React from "react";
import RecipeGrid from "../components/RecipeGrid";
import Footer from "../components/Footer";
import { Box, Container } from "@mui/material";

const Home = ({ searchQuery }) => {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <Container sx={{ width: "75%", py: 2 }}>
          <RecipeGrid searchQuery={searchQuery} />
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default Home;