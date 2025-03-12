import React, { useState } from "react";
import {
  Box,
  Typography,
  Container,
  TextField,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { toast } from "react-toastify";

const Contact = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Placeholder for form submission logic (e.g., API call)
    if (!formData.name || !formData.email || !formData.message) {
      toast.error("Please fill out all fields.");
      return;
    }
    toast.success("Message sent successfully! (Placeholder)");
    console.log("Form submitted:", formData);
    // Reset form
    setFormData({ name: "", email: "", message: "" });
    // Add your backend submission logic here (e.g., fetch to an API)
  };

  return (
    <Box
      sx={{
        padding: { xs: 2, sm: 3, md: 4 },
        backgroundColor: "#ecf0f1",
        minHeight: "100vh",
      }}
    >
      <Container maxWidth="md">
        <Box
          sx={{
            backgroundColor: "#fff",
            borderRadius: 2,
            boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            p: { xs: 2, sm: 3, md: 4 },
            mt: { xs: 2, md: 3 },
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
            Contact Us 📬
          </Typography>

          <Typography
            variant="body1"
            sx={{
              color: "#7f8c8d",
              textAlign: "center",
              mb: { xs: 3, md: 4 },
              fontSize: { xs: "0.9rem", md: "1rem" },
            }}
          >
            Have a question or suggestion? We’d love to hear from you!
          </Typography>

          <Box
            component="form"
            onSubmit={handleSubmit}
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: { xs: 2, md: 3 },
            }}
          >
            <TextField
              label="Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              size={isMobile ? "small" : "medium"}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#ddd" },
                  "&:hover fieldset": { borderColor: "#34495e" },
                  "&.Mui-focused fieldset": { borderColor: "#34495e" },
                },
              }}
            />

            <TextField
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              size={isMobile ? "small" : "medium"}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#ddd" },
                  "&:hover fieldset": { borderColor: "#34495e" },
                  "&.Mui-focused fieldset": { borderColor: "#34495e" },
                },
              }}
            />

            <TextField
              label="Message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              variant="outlined"
              fullWidth
              multiline
              rows={isMobile ? 3 : 4}
              size={isMobile ? "small" : "medium"}
              sx={{
                "& .MuiOutlinedInput-root": {
                  "& fieldset": { borderColor: "#ddd" },
                  "&:hover fieldset": { borderColor: "#34495e" },
                  "&.Mui-focused fieldset": { borderColor: "#34495e" },
                },
              }}
            />

            <Button
              type="submit"
              variant="contained"
              sx={{
                backgroundColor: "#e74c3c",
                "&:hover": { backgroundColor: "#c0392b" },
                padding: { xs: "8px 16px", md: "10px 20px" },
                fontSize: { xs: "0.9rem", md: "1rem" },
                mt: { xs: 1, md: 2 },
                alignSelf: "center",
                minWidth: { xs: "120px", md: "150px" },
              }}
            >
              Send Message
            </Button>
          </Box>
        </Box>

      </Container>
    </Box>
  );
};

export default Contact;
