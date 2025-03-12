import React from "react";
import { Box, Typography } from "@mui/material";
import { SectionTitle } from "./RecipeDetailStyles";
import EventIcon from "@mui/icons-material/Event";

const DetailsSection = ({ recipeDetail, isMobile }) => (
  <Box mt={isMobile ? 3 : 5}>
    <SectionTitle variant={isMobile ? "h6" : "h5"}>Details</SectionTitle>
    <Box sx={{ bgcolor: "#fff", p: 3, borderRadius: 2, boxShadow: 1 }}>
      {[
        {
          label: "Cuisines",
          value:
            recipeDetail.cuisines.length > 0
              ? recipeDetail.cuisines.join(", ")
              : "N/A",
        },
        { label: "Dish Types", value: recipeDetail.dishTypes.join(", ") },
        {
          label: "Occasions",
          value:
            recipeDetail.occasions.length > 0
              ? recipeDetail.occasions.map((occasion, i) => (
                  <span key={i}>
                    {occasion}{" "}
                    <EventIcon
                      sx={{
                        fontSize: 16,
                        color: "#3a5f3b",
                        verticalAlign: "middle",
                      }}
                    />
                    {i < recipeDetail.occasions.length - 1 && ", "}
                  </span>
                ))
              : "N/A",
        },
        {
          label: "Diets",
          value:
            recipeDetail.diets.length > 0
              ? recipeDetail.diets.join(", ")
              : "N/A",
        },
      ].map((item, i) => (
        <Typography
          key={i}
          sx={{
            color: "#6b7280",
            mb: 1,
            fontSize: isMobile ? "0.9rem" : "1rem",
          }}
        >
          <strong>{item.label}:</strong> {item.value}
        </Typography>
      ))}
      <Typography
        sx={{ color: "#6b7280", fontSize: isMobile ? "0.9rem" : "1rem" }}
      >
        <strong>Source:</strong>{" "}
        <a
          href={recipeDetail.sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: "#ff7043", textDecoration: "none" }}
          onMouseOver={(e) => (e.target.style.textDecoration = "underline")}
          onMouseOut={(e) => (e.target.style.textDecoration = "none")}
        >
          {recipeDetail.sourceName}
        </a>
      </Typography>
    </Box>
  </Box>
);

export default DetailsSection;
