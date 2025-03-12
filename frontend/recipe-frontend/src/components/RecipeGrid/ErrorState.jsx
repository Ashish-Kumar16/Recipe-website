import React from "react";
import { Box, Typography, Button } from "@mui/material";

const ErrorState = ({ error, retryAction }) => (
  <Box sx={{ textAlign: "center", py: 5 }}>
    <Typography sx={{ color: "#e74c3c", mb: 2, fontSize: "1.2rem" }}>
      😕 Oops! {error?.error || "Something went wrong"}
    </Typography>
    <Button
      variant="contained"
      sx={{
        background: "linear-gradient(45deg, #ff7043, #ffb300)",
        color: "#fff",
      }}
      onClick={retryAction}
    >
      Try Again
    </Button>
  </Box>
);

export default ErrorState;