import React from "react";
import {
  Box,
  Typography,
  Container,
  Divider,
  useTheme,
  useMediaQuery,
} from "@mui/material";

const About = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Box
      sx={{
        padding: { xs: 2, sm: 3, md: 4 },
        backgroundColor: "#ecf0f1",
        minHeight: "100vh", // Still fills the viewport height
      }}
    >
      <Container maxWidth="md">
        {/* Card moved to the top */}
        <Box
          sx={{
            backgroundColor: "#fff",
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            p: { xs: 2, sm: 3, md: 4 },
            mt: { xs: 2, md: 3 }, // Added top margin for spacing from the top edge
          }}
        >
          <Typography
            variant="h4"
            gutterBottom
            sx={{
              fontWeight: 600,
              textAlign: "center",
              color: "#34495e",
              mb: { xs: 2, md: 3 },
              fontSize: { xs: "1.75rem", sm: "2.25rem", md: "2.5rem" },
            }}
          >
            About Us 🍴
          </Typography>

          <Typography
            variant="h6"
            sx={{
              color: "#34495e",
              fontWeight: 500,
              mb: 2,
              fontSize: { xs: "1.25rem", sm: "1.5rem" },
            }}
          >
            Welcome to Your Recipe Haven
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#7f8c8d",
              lineHeight: 1.6,
              mb: 2,
              fontSize: { xs: "0.9rem", md: "1rem" },
            }}
          >
            We’re passionate about food and making cooking a delightful
            experience for everyone. Our mission is to help you discover, save,
            and organize your favorite recipes in one convenient place. Whether
            you’re a seasoned chef or just starting out, we’ve got something
            delicious for you.
          </Typography>

          <Divider sx={{ my: 2, borderColor: "#ddd" }} />

          <Typography
            variant="body2"
            sx={{
              mt: 2,
              color: "#7f8c8d",
              fontStyle: "italic",
              fontSize: { xs: "0.85rem", md: "0.95rem" },
            }}
          >
            "Cooking is love made visible." – Anonymous
          </Typography>
        </Box>

      </Container>
    </Box>
  );
};

export default About;
