import React from "react";
import {
  Box,
  Typography,
  CardMedia,
  Grid,
  IconButton,
  Tooltip,
} from "@mui/material";
import { StyledCard } from "./RecipeDetailStyles";
import ShareIcon from "@mui/icons-material/Share";
import PrintIcon from "@mui/icons-material/Print";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleIcon from "@mui/icons-material/People";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import StarIcon from "@mui/icons-material/Star";

const RecipeHeader = ({
  recipeDetail,
  isMobile,
  isRecipeSaved,
  handleShare,
  handlePrint,
  handleSaveToggle,
  servings,
}) => (
  <Grid container spacing={isMobile ? 2 : 4}>
    <Grid item xs={12} md={5}>
      <StyledCard>
        <CardMedia
          component="img"
          image={recipeDetail.image}
          alt={recipeDetail.title}
          sx={{
            height: isMobile ? 250 : 450,
            objectFit: "cover",
            transition: "transform 0.3s ease",
            "&:hover": { transform: "scale(1.02)" },
          }}
          onError={(e) =>
            (e.target.src = "https://via.placeholder.com/400x400")
          }
        />
      </StyledCard>
    </Grid>

    <Grid item xs={12} md={7}>
      <Typography
        variant={isMobile ? "h5" : "h4"}
        sx={{ fontWeight: 700, color: "#3a5f3b", mb: 2 }}
      >
        {recipeDetail.title}
      </Typography>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography sx={{ color: "#6b7280" }}>
          By {recipeDetail.creditsText || "Unknown"}
        </Typography>
        <Box display="flex" gap={1}>
          <Tooltip title="Share">
            <IconButton onClick={handleShare} sx={{ color: "#3a5f3b" }}>
              <ShareIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Print">
            <IconButton onClick={handlePrint} sx={{ color: "#3a5f3b" }}>
              <PrintIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title={isRecipeSaved ? "Unsave" : "Save"}>
            <IconButton onClick={handleSaveToggle}>
              <BookmarkIcon
                sx={{ color: isRecipeSaved ? "#ff7043" : "#3a5f3b" }}
              />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box display="flex" gap={isMobile ? 1 : 3} flexWrap="wrap" mb={2}>
        {[
          {
            icon: <AccessTimeIcon />,
            text: `${recipeDetail.readyInMinutes} min`,
          },
          { icon: <PeopleIcon />, text: `${servings} servings` },
          {
            icon: <RestaurantIcon />,
            text: recipeDetail.vegan
              ? "Vegan"
              : recipeDetail.vegetarian
              ? "Vegetarian"
              : "Non-Veg",
            color: recipeDetail.vegan
              ? "#2ecc71"
              : recipeDetail.vegetarian
              ? "#2ecc71"
              : "#e74c3c",
          },
        ].map((item, idx) => (
          <Box key={idx} display="flex" alignItems="center" gap={1}>
            {React.cloneElement(item.icon, { sx: { color: "#3a5f3b" } })}
            <Typography sx={{ color: item.color || "#6b7280" }}>
              {item.text}
            </Typography>
          </Box>
        ))}
      </Box>

      <Box display="flex" alignItems="center" mb={2}>
        {[...Array(5)].map((_, i) => (
          <StarIcon
            key={i}
            sx={{
              color:
                i < Math.round(recipeDetail.spoonacularScore / 20)
                  ? "#ff7043"
                  : "#ddd",
            }}
          />
        ))}
        <Typography sx={{ ml: 1, color: "#6b7280" }}>
          ({recipeDetail.aggregateLikes || 0} Likes)
        </Typography>
      </Box>

      <Typography
        sx={{
          color: "#6b7280",
          fontSize: isMobile ? "0.9rem" : "1rem",
          lineHeight: 1.6,
        }}
        dangerouslySetInnerHTML={{ __html: recipeDetail.summary }}
      />
    </Grid>
  </Grid>
);

export default RecipeHeader;
