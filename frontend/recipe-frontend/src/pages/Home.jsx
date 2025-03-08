import React, { useState } from "react";
import RecipeGrid from "../components/RecipeGrid";
import Footer from "../components/Footer";
import SearchResults from "../pages/SearchResults";
import { Box, Container } from "@mui/material";

const Home = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handleSearch = (query, page) => {
    setSearchQuery(query);
    setCurrentPage(page);
    const fetchedTotalPages = 5; // Simulate total pages
    setTotalPages(fetchedTotalPages);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <Box sx={{ flex: 1, display: "flex", justifyContent: "center" }}>
        <Container sx={{ width: "75%", py: 2 }}>
          {searchQuery.trim() ? (
            <SearchResults
              searchQuery={searchQuery}
              page={currentPage}
              setTotalPages={setTotalPages}
            />
          ) : (
            <RecipeGrid searchQuery={searchQuery} />
          )}
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default Home;
