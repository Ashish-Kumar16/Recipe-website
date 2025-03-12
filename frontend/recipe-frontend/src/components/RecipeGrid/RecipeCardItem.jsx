import React from "react";
import {
  CardContent,
  Typography,
  Box,
  IconButton,
  Tooltip,
} from "@mui/material";
import { RecipeCard, OverlayButton } from "./RecipeGridStyles";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import { Fade } from "@mui/material";

const RecipeCardItem = ({
  recipe,
  savedRecipes,
  handleCardClick,
  handleBookmarkClick,
}) => (
  <Fade in={true} timeout={500}>
    <RecipeCard>
      <Box
        sx={{
          position: "relative",
          "&:hover .overlay": { opacity: 1 },
          "&:hover img": { filter: "brightness(70%)" },
        }}
      >
        <img
          src={recipe.image}
          alt={recipe.title}
          style={{
            width: "100%",
            height: "220px",
            objectFit: "cover",
            transition: "filter 0.3s ease",
          }}
        />
        <OverlayButton
          className="overlay"
          onClick={(e) => {
            e.stopPropagation();
            handleCardClick(recipe.id);
          }}
        >
          View Recipe
        </OverlayButton>
      </Box>
      <CardContent sx={{ p: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography
            variant="caption"
            sx={{
              color: recipe.vegan ? "#2ecc71" : "#e74c3c",
              fontWeight: 600,
            }}
          >
            {recipe.vegan ? "Veg" : "Non-Veg"}
          </Typography>
          <Tooltip title={savedRecipes.includes(recipe.id) ? "Unsave" : "Save"}>
            <IconButton
              onClick={(e) => {
                e.stopPropagation();
                handleBookmarkClick(recipe.id);
              }}
              sx={{
                color: savedRecipes.includes(recipe.id) ? "#e74c3c" : "#6b7280",
              }}
            >
              <BookmarkIcon />
            </IconButton>
          </Tooltip>
        </Box>
        <Typography
          variant="h6"
          sx={{
            fontFamily: "Poppins, sans-serif",
            fontWeight: 600,
            color: "#2f2f2f",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
        >
          {recipe.title}
        </Typography>
        <Box display="flex" justifyContent="space-between" mt={1}>
          <Box display="flex" alignItems="center" gap={0.5}>
            <AccessTimeIcon sx={{ color: "#3a5f3b", fontSize: 18 }} />
            <Typography variant="body2" sx={{ color: "#6b7280" }}>
              {recipe.readyInMinutes}m
            </Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={0.5}>
            <ThumbUpIcon sx={{ color: "#3a5f3b", fontSize: 18 }} />
            <Typography variant="body2" sx={{ color: "#6b7280" }}>
              {recipe.aggregateLikes || 0}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </RecipeCard>
  </Fade>
);

export default RecipeCardItem;