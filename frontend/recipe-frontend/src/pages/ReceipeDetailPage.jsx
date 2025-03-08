import React from "react";
import Navbar from "../components/Navbar";
import RecipeDetail from "../components/RecipeDetail";
import Footer from "../components/Footer";
import { Box, Container } from "@mui/material";

const ReceipeDetail = () => {
  return (
    <>
      {/* <Navbar /> */}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Container sx={{ width: "75%" }}>
          <RecipeDetail />
        </Container>
      </Box>
      <Footer />
    </>
  );
};

export default ReceipeDetail;
