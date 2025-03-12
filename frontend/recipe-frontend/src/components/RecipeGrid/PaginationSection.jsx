import React from "react";
import { Box, Pagination } from "@mui/material";

const PaginationSection = ({ totalPages, currentPage, setCurrentPage }) => (
  <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
    <Pagination
      count={totalPages}
      page={currentPage}
      onChange={(e, page) => setCurrentPage(page)}
      sx={{
        "& .MuiPaginationItem-root": {
          color: "#3a5f3b",
          "&:hover": { backgroundColor: "#f0f4f0" },
          "&.Mui-selected": {
            background: "linear-gradient(45deg, #ff7043, #ffb300)",
            color: "#fff",
          },
        },
      }}
    />
  </Box>
);

export default PaginationSection;
