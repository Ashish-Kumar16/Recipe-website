import { styled } from "@mui/system";
import { Box, Button, Typography, Card } from "@mui/material";

export const RecipeContainer = styled(Box)(({ theme }) => ({
  // background: "linear-gradient(to bottom, #fdfaf6, #f9f1e7)",
  // padding: theme.spacing(2),
  [theme.breakpoints.up("sm")]: {
    padding: theme.spacing(4),
  },
  borderRadius: "16px",
  boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
  maxWidth: "1200px",
  margin: "0 auto",
}));

export const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: "16px",
  boxShadow: "0 6px 20px rgba(0, 0, 0, 0.1)",
  overflow: "hidden",
  height: "100%",
  [theme.breakpoints.down("md")]: {
    marginBottom: theme.spacing(2),
  },
}));

export const GradientButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(45deg, #ff7043, #ffb300)",
  color: "#fff",
  padding: theme.spacing(1, 3),
  borderRadius: "8px",
  fontWeight: 600,
  "&:hover": {
    background: "linear-gradient(45deg, #ffb300, #ff7043)",
    transform: "translateY(-2px)",
  },
  transition: "all 0.3s ease",
}));

export const SectionTitle = styled(Typography)(({ theme }) => ({
  fontFamily: "Poppins, sans-serif",
  fontWeight: 700,
  color: "#3a5f3b",
  marginBottom: theme.spacing(2),
  position: "relative",
  "&:after": {
    content: '""',
    position: "absolute",
    bottom: -8,
    left: 0,
    width: "50px",
    height: "3px",
    background: "#ff7043",
    borderRadius: "2px",
  },
}));
