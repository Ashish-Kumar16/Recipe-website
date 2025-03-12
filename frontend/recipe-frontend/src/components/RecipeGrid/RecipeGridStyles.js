// RecipeGridStyles.js
import { styled } from "@mui/system";
import { Card, Button, Box } from "@mui/material";

export const RecipeCard = styled(Card)({
  borderRadius: "16px",
  overflow: "hidden",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.06)",
  transition: "transform 0.3s ease, box-shadow 0.3s ease",
  "&:hover": {
    transform: "translateY(-4px)",
    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
  },
  position: "relative",
  backgroundColor: "#FFFFFF", // White for cards
});

export const OverlayButton = styled(Button)({
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  background: "linear-gradient(45deg, #FFA500, #FFD700)", // Orange to Gold
  color: "#4A2C2A", // Dark Brown text
  padding: "10px 20px",
  borderRadius: "24px",
  opacity: 0,
  transition: "opacity 0.3s ease",
  fontWeight: 600,
  "&:hover": {
    background: "linear-gradient(45deg, #FFD700, #FFA500)", // Reverse gradient
  },
});

export const FilterBox = styled(Box)({
  background: "linear-gradient(to bottom, #FFFFFF, #FFF8E7)", // White to Cosmic Latte
  borderRadius: "12px",
  padding: "20px",
  boxShadow: "0 3px 10px rgba(0, 0, 0, 0.04)",
  overflowX: "auto",
  whiteSpace: "nowrap",
  "&::-webkit-scrollbar": { height: "6px" },
  "&::-webkit-scrollbar-thumb": {
    background: "#8B4513", // Saddle Brown
    borderRadius: "3px",
    opacity: 0.7,
  },
});
