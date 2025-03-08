const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const morgan = require("morgan");
const session = require("express-session");
const MongoDBStore = require("connect-mongodb-session")(session);
const connectDB = require("./config/db");
const passport = require("./config/passport");

dotenv.config();

// Ensure required environment variables exist
const requiredEnvVars = [
  "MONGO_URI",
  "JWT_SECRET",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Connect to MongoDB
connectDB();

// Setup MongoDB session store
const store = new MongoDBStore({
  uri: process.env.MONGO_URI,
  collection: "sessions",
});

// Initialize Express
const app = express();
app.set("trust proxy", 1); // Trust Render's proxy

// Rate limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: { error: "Too many auth attempts, please try again later" },
  standardHeaders: true,
  legacyHeaders: false,
});

const recipeLimiter = rateLimit({
  windowMs: 1 * 60 * 1000,
  max: 200,
  message: { error: "Too many recipe requests, please slow down" },
  standardHeaders: true,
  legacyHeaders: false,
});

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [
        "http://localhost:5173",
        "https://search-intresting-recipes.netlify.app",
      ];
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        origin.endsWith("--search-intresting-recipes.netlify.app")
      ) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);
app.use(helmet());
app.use(morgan("dev"));

// Use MongoDB for session store
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    store: store,
    cookie: {
      secure: process.env.NODE_ENV === "production",
      httpOnly: true,
      maxAge: 1000 * 60 * 60 * 24, // 1 day
    },
  }),
);

app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use("/api/auth", authLimiter, require("./routes/authRoutes"));
app.use("/api/recipes", recipeLimiter, require("./routes/recipeRoutes"));

// Global error handler
app.use((err, req, res, next) => {
  console.error("Error:", err.stack);
  res.status(500).json({ error: "Something went wrong!" });
});

// Start server
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Graceful shutdown
process.on("SIGINT", () => {
  server.close(() => process.exit(0));
});
process.on("SIGTERM", () => {
  server.close(() => process.exit(0));
});
