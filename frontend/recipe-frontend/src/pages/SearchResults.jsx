import React from "react";
import { useSearchParams } from "react-router-dom";
import RecipeGrid from "../components/RecipeGrid";
import { Typography, Box } from "@mui/material";

const SearchResults = ({ searchQuery: propSearchQuery }) => {
  const [searchParams] = useSearchParams();
  // Use prop if provided (from Home), otherwise use URL query
  const searchQuery = propSearchQuery || searchParams.get("query") || "";

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
