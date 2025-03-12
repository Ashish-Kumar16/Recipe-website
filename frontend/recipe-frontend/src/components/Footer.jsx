import React from "react";
import { Box, Typography, TextField, IconButton, Button } from "@mui/material";
import { ArrowUpward, Send } from "@mui/icons-material";

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: "#fdf9f6",
        textAlign: "center",
        padding: "60px 20px",
        fontFamily: "Georgia, serif",
        position: "relative",
      }}
    >
      <Typography variant="h4" sx={{ fontStyle: "italic", fontWeight: "bold" }}>
        Recipe Haven
      </Typography>
      <Typography
        variant="subtitle2"
        sx={{ color: "#d55", letterSpacing: 2, fontWeight: "bold", mt: -0.5 }}
      >
        COOKING FOR THE SOUL
      </Typography>
      <Typography
        variant="caption"
        sx={{ color: "#999", fontStyle: "italic", mt: 1 }}
      >
        Be informed about the latest recipes & workshops.
      </Typography>

      {/* Footer Bottom Section */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          maxWidth: 600,
          mx: "auto",
          mt: 5,
        }}
      >
        <Typography variant="caption" sx={{ color: "#999" }}>
          Privacy Policy
        </Typography>
        <Typography variant="caption" sx={{ color: "#999" }}>
          © 2025 Recipe Haven, All Rights Reserved
        </Typography>
      </Box>
    </Box>
  );
};

export default Footer;
