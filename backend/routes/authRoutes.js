// authRoutes.js
const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const {
  register,
  login,
  getProfile,
} = require("../controllers/authController");

const router = express.Router();

router.post("/register", register);
router.post("/login", login);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    try {
      if (!req.user) {
        console.error("No user found after Google authentication");
        return res.status(500).json({ error: "Authentication failed" });
      }
      const token = jwt.sign({ id: req.user._id }, process.env.JWT_SECRET, {
        expiresIn: "1h",
      });
      console.log("Google callback successful, redirecting with token:", token);
      res.redirect(`http://localhost:5173/oauth/callback?token=${token}`);
    } catch (err) {
      console.error("Error in Google callback:", err);
      res.status(500).json({ error: "Something went wrong!" });
    }
  },
);

// New profile route
router.get("/profile", getProfile);

module.exports = router;
