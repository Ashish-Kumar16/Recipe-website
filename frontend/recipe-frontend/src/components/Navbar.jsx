import React, { useState, useEffect } from "react";
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Avatar,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Search as SearchIcon,
  Clear as ClearIcon,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/authSlice";
import { fetchSavedRecipes } from "../features/savedRecipesSlice";
import AuthCard from "./AuthCard";

const Navbar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [openAuth, setOpenAuth] = useState(false);

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { data: savedRecipes } = useSelector((state) => state.savedRecipes);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchSavedRecipes());
    }
  }, [isAuthenticated, dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Redirect to homepage with search query
      navigate("/", { state: { searchQuery: searchQuery.trim() } });
      onSearch(searchQuery.trim()); // Pass query to parent component
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    onSearch(""); // Clear search results in parent component
    // Optionally redirect to homepage without query
    if (location.pathname !== "/") {
      navigate("/");
    }
  };

  const handleProfileClick = (event) => {
    if (isAuthenticated) {
      setAnchorEl(event.currentTarget);
    } else {
      setOpenAuth(true);
    }
  };

  const handleMenuOpen = (event) => {
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
  };

  const handleAuthClose = () => {
    setOpenAuth(false);
  };

  const handleMenuItemClick = (path) => {
    navigate(path === "/home" ? "/" : path);
    handleMenuClose();
  };

  const LogoComponent = () => (
    <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
      <Box sx={{ textAlign: "left" }}>
        <Typography
          variant="h4"
          fontFamily="cursive"
          fontStyle="italic"
          fontWeight="bold"
        >
          Recipe
        </Typography>
        <Typography
          variant="body2"
          sx={{ letterSpacing: 2, color: "#ff7043", fontWeight: "bold" }}
        >
          COOKING FOR THE SOUL
        </Typography>
      </Box>
    </Link>
  );

  return (
    <AppBar
      position="static"
      sx={{
        backgroundColor: "white",
        color: "black",
        boxShadow: "none",
        padding: 2,
      }}
    >
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100px" }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            paddingBottom: 1,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {isMobile && (
              <IconButton
                edge="start"
                color="inherit"
                aria-label="menu"
                onClick={handleMenuOpen}
                sx={{ mr: 1 }}
              >
                <MenuIcon />
              </IconButton>
            )}
            <LogoComponent />
          </Box>

          {!isMobile && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 3,
                position: "absolute",
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              {["Home", "Saved Recipe", "About us", "Contact us"].map(
                (text) => (
                  <Link
                    key={text}
                    to={
                      text === "Home"
                        ? "/"
                        : `/${text.toLowerCase().replace(" ", "-")}`
                    }
                    style={{
                      textDecoration: "none",
                      fontSize: "1.1rem",
                      fontWeight:
                        location.pathname ===
                        (text === "Home"
                          ? "/"
                          : `/${text.toLowerCase().replace(" ", "-")}`)
                          ? "bold"
                          : "normal",
                      color:
                        location.pathname ===
                        (text === "Home"
                          ? "/"
                          : `/${text.toLowerCase().replace(" ", "-")}`)
                          ? "#ff7043"
                          : "black",
                    }}
                  >
                    {text}
                    {text === "Saved Recipe" && ` (${savedRecipes.length})`}
                  </Link>
                ),
              )}
            </Box>
          )}

          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {isAuthenticated ? (
                <IconButton onClick={handleProfileClick}>
                  <Avatar
                    sx={{ bgcolor: "#ff7043" }}
                    alt={user?.name || user?.email || "User"}
                    src="/broken-image.jpg"
                  >
                    {user?.name
                      ? user.name[0].toUpperCase()
                      : user?.email
                      ? user.email[0].toUpperCase()
                      : "U"}
                  </Avatar>
                </IconButton>
              ) : (
                <Typography
                  sx={{
                    fontSize: "1.1rem",
                    color: "#ff7043",
                    cursor: "pointer",
                    "&:hover": { textDecoration: "underline" },
                  }}
                  onClick={() => setOpenAuth(true)}
                >
                  login
                </Typography>
              )}
            </Box>
          )}
        </Toolbar>

        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            paddingTop: 1,
            borderTop: "1px solid lightgray",
          }}
        >
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              display: "flex",
              alignItems: "center",
              width: { xs: "80%", sm: "400px" },
              maxWidth: "500px",
              bgcolor: "white",
              borderRadius: "25px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.1)",
              padding: "4px 10px",
              position: "relative",
              transition: "box-shadow 0.3s ease",
              "&:hover": {
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
              },
            }}
          >
            <IconButton
              type="submit"
              sx={{
                p: "6px",
                color: "#ff7043",
                "&:hover": { color: "#f4511e" },
              }}
            >
              <SearchIcon />
            </IconButton>
            <InputBase
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                flex: 1,
                fontSize: "1rem",
                color: "#2c3e50",
                "& .MuiInputBase-input": {
                  padding: "8px 0",
                },
                "&::placeholder": {
                  color: "#7f8c8d",
                  opacity: 1,
                },
              }}
            />
            {searchQuery && (
              <IconButton
                onClick={handleClear}
                sx={{
                  p: "6px",
                  color: "#7f8c8d",
                  "&:hover": { color: "#d32f2f" },
                }}
              >
                <ClearIcon />
              </IconButton>
            )}
          </Box>
        </Box>

        {isMobile && (
          <Menu
            anchorEl={menuAnchorEl}
            open={Boolean(menuAnchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "top", horizontal: "left" }}
            transformOrigin={{ vertical: "top", horizontal: "left" }}
          >
            <MenuItem onClick={() => handleMenuItemClick("/")}>Home</MenuItem>
            <MenuItem onClick={() => handleMenuItemClick("/saved-recipe")}>
              Saved Recipes ({savedRecipes.length})
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick("/")}>
              About us
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick("/")}>
              Contact us
            </MenuItem>
            {isAuthenticated ? (
              <MenuItem onClick={handleLogout}>Logout</MenuItem>
            ) : (
              <MenuItem
                onClick={() => {
                  setOpenAuth(true);
                  handleMenuClose();
                }}
              >
                Login
              </MenuItem>
            )}
          </Menu>
        )}

        {!isMobile && (
          <Menu
            id="profile-menu"
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        )}

        <AuthCard open={openAuth} onClose={handleAuthClose} />
      </Box>
    </AppBar>
  );
};

export default Navbar;
