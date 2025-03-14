import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch } from "react-redux";
import { loginUser, registerUser } from "../features/authSlice";
import { toast } from "react-toastify";

// Styled Google Button
const GoogleButton = styled(Button)(({ theme }) => ({
  width: "100%",
  padding: theme.spacing(1.5),
  backgroundColor: "#fff",
  color: "#4285f4", // Google blue
  textTransform: "none",
  fontWeight: 500,
  fontSize: "1rem",
  border: "1px solid #dadce0",
  borderRadius: theme.shape.borderRadius,
  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  marginTop: theme.spacing(2),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "&:hover": {
    backgroundColor: "#f8f9fa",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.15)",
  },
}));

// Styled Dialog
const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    borderRadius: "16px",
    border: "2px solid #ff7043", // Orange border to match the image
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
    overflow: "hidden",
    maxWidth: "800px", // Wider dialog for two columns
    width: "100%",
    [theme.breakpoints.down("sm")]: {
      margin: "16px",
    },
  },
}));

// Image Section (now Text Section)
const TextSection = styled(Box)(({ theme }) => ({
  backgroundColor: "#f9f1e7",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(3),
  minHeight: "100%", // Ensure it fills the section height
  [theme.breakpoints.down("sm")]: {
    display: "none", // Hide text section on mobile
  },
}));

// Form Section
const FormSection = styled(Box)(({ theme }) => ({
  padding: theme.spacing(4),
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  backgroundColor: "#fff",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(2),
  },
}));

const AuthCard = ({ open, onClose }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const dispatch = useDispatch();

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(loginUser({ email, password }));
      if (loginUser.fulfilled.match(resultAction)) {
        // toast.success("Login successful!");
        onClose();
      } else {
        toast.error(resultAction.payload || "Login failed");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    try {
      const resultAction = await dispatch(
        registerUser({ name, email, password }),
      );
      if (registerUser.fulfilled.match(resultAction)) {
        // toast.success("Registration successful!");
        onClose();
      } else {
        toast.error(resultAction.payload || "Registration failed");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  return (
    <StyledDialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" } }}>
        {/* Left Side: Text Section with Recipe Haven */}
        <TextSection sx={{ flex: 1 }}>
          <Box
            sx={{
              textAlign: "center",
              transition: "transform 0.3s ease",
              "&:hover": { transform: "scale(1.05)" },
            }}
          >
            <Typography
              variant="h4"
              sx={{
                fontFamily: "'Dancing Script', cursive",
                fontWeight: 700,
                color: "#3a5f3b",
              }}
            >
              Recipe Haven
            </Typography>
            <Typography
              variant="body2"
              sx={{
                letterSpacing: 2,
                color: "#ff7043",
                fontFamily: "Poppins, sans-serif",
                fontWeight: 600,
              }}
            >
              COOKING FOR THE SOUL
            </Typography>
          </Box>
        </TextSection>

        {/* Right Side: Form Section */}
        <FormSection sx={{ flex: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <IconButton
              onClick={onClose}
              aria-label="close"
              sx={{ color: "#7f8c8d" }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <DialogTitle sx={{ padding: 0, mb: 1 }}>
            <Typography
              variant="h4"
              sx={{
                fontFamily: "Poppins, sans-serif",
                fontWeight: 700,
                color: "#2c3e50",
              }}
            >
              {isSignUp ? "Create Account" : "Welcome Back"}
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ padding: 0 }}>
            <Box
              component="form"
              onSubmit={isSignUp ? handleSignUp : handleSignIn}
              sx={{ display: "flex", flexDirection: "column", gap: 2 }}
            >
              {isSignUp && (
                <TextField
                  fullWidth
                  label="Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  variant="outlined"
                  size="small"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 1,
                      "&:hover fieldset": { borderColor: "#ff7043" },
                      "&.Mui-focused fieldset": { borderColor: "#ff7043" },
                    },
                    "& .MuiInputLabel-root": {
                      fontFamily: "Poppins, sans-serif",
                      fontSize: "1rem",
                    },
                  }}
                />
              )}
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                    "&:hover fieldset": { borderColor: "#ff7043" },
                    "&.Mui-focused fieldset": { borderColor: "#ff7043" },
                  },
                  "& .MuiInputLabel-root": {
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "1rem",
                  },
                }}
              />
              <TextField
                fullWidth
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                variant="outlined"
                size="small"
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 1,
                    "&:hover fieldset": { borderColor: "#ff7043" },
                    "&.Mui-focused fieldset": { borderColor: "#ff7043" },
                  },
                  "& .MuiInputLabel-root": {
                    fontFamily: "Poppins, sans-serif",
                    fontSize: "1rem",
                  },
                }}
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{
                  padding: 1.5,
                  borderRadius: 1,
                  backgroundColor: "#F4511E",
                  textTransform: "none",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  "&:hover": { backgroundColor: "#F4511E" },
                }}
              >
                {isSignUp ? "Sign Up" : "Sign In"}
              </Button>
            </Box>
            <Typography
              align="center"
              sx={{ mt: 2, color: "#7f8c8d", fontSize: "0.9rem" }}
            >
              {isSignUp ? "Already have an account?" : "Don’t have an account?"}{" "}
              <Box
                component="span"
                onClick={() => setIsSignUp(!isSignUp)}
                sx={{
                  color: "#1976d2",
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
              >
                {isSignUp ? "Sign In" : "Sign Up"}
              </Box>
            </Typography>
            <GoogleButton
              href="https://recipe-website-arnr.onrender.com/api/auth/google"
              startIcon={
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M17.64 9.2c0-.638-.057-1.251-.164-1.84H9v3.481h4.844c-.21 1.125-.843 2.078-1.797 2.716v2.258h2.908c1.702-1.567 2.686-3.874 2.686-6.615z"
                    fill="#4285F4"
                  />
                  <path
                    d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z"
                    fill="#34A853"
                  />
                  <path
                    d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71s.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.347 3.827.957 5.042h3.007v-2.332z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958h3.007c.708-2.127 2.692-3.58 5.036-3.58z"
                    fill="#EA4335"
                  />
                </svg>
              }
            >
              Sign in with Google
            </GoogleButton>
          </DialogContent>
          <DialogActions sx={{ padding: 2 }}>
            <Button
              onClick={onClose}
              variant="outlined"
              sx={{
                borderColor: "#d32f2f",
                color: "#d32f2f",
                "&:hover": { borderColor: "#b71c1c", color: "#b71c1c" },
              }}
            >
              Close
            </Button>
          </DialogActions>
        </FormSection>
      </Box>
    </StyledDialog>
  );
};

export default AuthCard;
