import React from "react";
import { Box, Typography } from "@mui/material";
import { SectionTitle } from "./RecipeDetailStyles";

const DirectionsSection = ({ recipeDetail, isMobile }) => (
  <Box mt={isMobile ? 3 : 5}>
    <SectionTitle variant={isMobile ? "h6" : "h5"}>Directions</SectionTitle>
    {recipeDetail.analyzedInstructions[0]?.steps.map((step) => (
      <Box
        key={step.number}
        sx={{
          mb: 3,
          p: 2,
          bgcolor: "#fff",
          borderRadius: 2,
          boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
          transition: "all 0.3s ease",
          "&:hover": { boxShadow: "0 4px 12px rgba(0,0,0,0.1)" },
        }}
      >
        <Box display="flex" alignItems="flex-start" gap={2}>
          <Box
            sx={{
              minWidth: 32,
              height: 32,
              bgcolor: "#ff7043",
              color: "#fff",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 600,
              flexShrink: 0,
            }}
          >
            {step.number}
          </Box>
          <Typography
            sx={{
              color: "#2f2f2f",
              fontSize: isMobile ? "0.9rem" : "1rem",
              lineHeight: 1.6,
            }}
          >
            {step.step}
          </Typography>
        </Box>
        {step.equipment?.length > 0 && (
          <Box mt={1} ml={5}>
            <Typography sx={{ color: "#6b7280", fontSize: "0.9rem" }}>
              Equipment:
            </Typography>
            <Box display="flex" gap={2} flexWrap="wrap">
              {step.equipment.map((equip, i) => (
                <Typography
                  key={i}
                  sx={{
                    color: "#3a5f3b",
                    fontSize: "0.9rem",
                    bgcolor: "#f0f4f0",
                    px: 1,
                    py: 0.5,
                    borderRadius: 1,
                  }}
                >
                  {equip.name}
                </Typography>
              ))}
            </Box>
          </Box>
        )}
      </Box>
    ))}
  </Box>
);

export default DirectionsSection;
