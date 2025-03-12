// LoadingSkeleton.js
import React from "react";
import { Box, Skeleton, Grid } from "@mui/material";

const LoadingSkeleton = ({ itemsPerPage }) => (
  <>
    {[...Array(itemsPerPage)].map((_, index) => (
      <Grid item xs={12} sm={6} md={4} key={index}>
        <Box sx={{ p: 1.5 }}>
          <Skeleton
            variant="rectangular"
            height={240}
            animation="wave"
            sx={{ borderRadius: "16px", bgcolor: "#FFF8E7" }} // Cosmic Latte
          />
          <Skeleton
            variant="text"
            width="70%"
            height={35}
            animation="wave"
            sx={{ mt: 2, bgcolor: "#FFF8E7" }}
          />
          <Skeleton
            variant="text"
            width="50%"
            height={25}
            animation="wave"
            sx={{ bgcolor: "#FFF8E7" }}
          />
        </Box>
      </Grid>
    ))}
  </>
);

export default LoadingSkeleton;
