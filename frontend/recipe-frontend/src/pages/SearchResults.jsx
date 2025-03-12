import React from "react";
import RecipeGrid from "../components//RecipeGrid/MainRecipeGrid";
import { Typography, Box } from "@mui/material";

const SearchResults = ({ searchQuery }) => {
  return (
    <Box>
      <Typography variant="h4" gutterBottom sx={{ textAlign: "center", mt: 4 }}>
        Search Results for "{searchQuery}"
      </Typography>
      <RecipeGrid searchQuery={searchQuery} />
    </Box>
  );
};

export default SearchResults;
