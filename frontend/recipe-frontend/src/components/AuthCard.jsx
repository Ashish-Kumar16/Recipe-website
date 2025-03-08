import React, { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  Checkbox,
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
        toast.success("Login successful!");
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
        toast.success("Registration successful!");
        onClose();
      } else {
        toast.error(resultAction.payload || "Registration failed");
      }
    } catch (err) {
      toast.error("An error occurred");
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 2,
          boxShadow: "0 4px 20px rgba(0, 0, 0, 0.15)",
          padding: 1,
        },
      }}
    >
      <DialogTitle sx={{ display: "flex", alignItems: "center", padding: 2 }}>
        <Typography
          variant="h5"
          component="div"
          sx={{ flexGrow: 1, fontWeight: "bold", color: "#2c3e50" }}
        >
          {isSignUp ? "Create Account" : "Welcome Back"}
        </Typography>
        <IconButton
          onClick={onClose}
          aria-label="close"
          sx={{ color: "#7f8c8d" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent sx={{ padding: 3 }}>
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
                  "&:hover fieldset": { borderColor: "#1976d2" },
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
                "&:hover fieldset": { borderColor: "#1976d2" },
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
                "&:hover fieldset": { borderColor: "#1976d2" },
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
          href="http://localhost:5000/api/auth/google"
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
    </Dialog>
  );
};

export default AuthCard;
