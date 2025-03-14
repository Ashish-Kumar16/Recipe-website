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
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/authSlice";
import { fetchSavedRecipes } from "../features/savedRecipesSlice";
import AuthCard from "./AuthCard";
import { styled, keyframes } from "@mui/system";

const pulse = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(255, 112, 67, 0.7); }
  70% { box-shadow: 0 0 0 10px rgba(255, 112, 67, 0); }
  100% { box-shadow: 0 0 0 0 rgba(255, 112, 67, 0); }
`;

const StyledAppBar = styled(AppBar)({
  background: "linear-gradient(to right, #ffffff, #f9f1e7)",
  boxShadow: "0 4px 15px rgba(0, 0, 0, 0.05)",
  padding: "10px 20px",
});

const SearchBox = styled(Box)({
  display: "flex",
  alignItems: "center",
  width: { xs: "90%", sm: "450px" },
  maxWidth: "600px",
  backgroundColor: "#fff",
  borderRadius: "30px",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
  padding: "6px 12px",
  transition: "all 0.3s ease",
  "&:hover": { boxShadow: "0 6px 18px rgba(0, 0, 0, 0.15)" },
  "&:focus-within": { border: "2px solid #3a5f3b" },
});

const StyledMenuItem = styled(MenuItem)({
  fontFamily: "Poppins, sans-serif",
  color: "#2f2f2f",
  "&:hover": { backgroundColor: "#f0f4f0", color: "#3a5f3b" },
});

const Navbar = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [openAuth, setOpenAuth] = useState(false);

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { data: savedRecipes } = useSelector((state) => state.savedRecipes);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchSavedRecipes());
  }, [isAuthenticated, dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery.trim());
      navigate("/", { state: { searchQuery: searchQuery.trim() } });
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    onSearch(""); // Reset search to show all recipes
    navigate("/"); // Redirect to home
  };

  const handleProfileClick = (event) => {
    if (isAuthenticated) setAnchorEl(event.currentTarget);
    else setOpenAuth(true);
  };

  const handleMenuOpen = (event) => setMenuAnchorEl(event.currentTarget);
  const handleMenuClose = () => {
    setMenuAnchorEl(null);
    setAnchorEl(null);
  };

  const handleLogout = () => {
    dispatch(logout());
    handleMenuClose();
  };

  const handleAuthClose = () => setOpenAuth(false);

  const handleMenuItemClick = (path) => {
    navigate(path === "/home" ? "/" : path);
    handleMenuClose();
  };

  const LogoComponent = () => (
    <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
      <Box sx={{ textAlign: "left", transition: "transform 0.3s ease", "&:hover": { transform: "scale(1.05)" } }}>
        <Typography variant="h4" sx={{ fontFamily: "'Dancing Script', cursive", fontWeight: 700, color: "#3a5f3b" }}>
          Recipe Haven
        </Typography>
        <Typography variant="body2" sx={{ letterSpacing: 2, color: "#ff7043", fontFamily: "Poppins, sans-serif", fontWeight: 600 }}>
          COOKING FOR THE SOUL
        </Typography>
      </Box>
    </Link>
  );

  return (
    <StyledAppBar position="static">
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "110px" }}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", paddingBottom: 1 }}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {isMobile && (
              <IconButton edge="start" sx={{ color: "#3a5f3b", mr: 1 }} onClick={handleMenuOpen}>
                <MenuIcon />
              </IconButton>
            )}
            <LogoComponent />
          </Box>

          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 4, position: "absolute", left: "50%", transform: "translateX(-50%)" }}>
              {["Home", "Saved Recipe", "About us", "Contact us"].map((text) => (
                <Link
                  key={text}
                  to={text === "Home" ? "/" : `/${text.toLowerCase().replace(" ", "-")}`}
                  style={{ textDecoration: "none", fontSize: "1.1rem", fontFamily: "Poppins, sans-serif", fontWeight: 400, color: "#2f2f2f" }}
                >
                  {text}
                  {text === "Saved Recipe" && ` (${savedRecipes.length})`}
                </Link>
              ))}
            </Box>
          )}

          {!isMobile && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              {isAuthenticated ? (
                <IconButton onClick={handleProfileClick}>
                  <Avatar sx={{ bgcolor: "#ff7043", animation: `${pulse} 2s infinite`, "&:hover": { bgcolor: "#ffb300" } }}>
                    {user?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase() || "U"}
                  </Avatar>
                </IconButton>
              ) : (
                <Typography sx={{ fontSize: "1.1rem", fontFamily: "Poppins, sans-serif", color: "#ff7043", cursor: "pointer", "&:hover": { color: "#ffb300" } }} onClick={() => setOpenAuth(true)}>
                  Login
                </Typography>
              )}
            </Box>
          )}
        </Toolbar>

        <Box sx={{ display: "flex", justifyContent: "center", paddingTop: 1 }}>
          <SearchBox component="form" onSubmit={handleSearch}>
            <IconButton type="submit" sx={{ p: "6px", color: "#3a5f3b", "&:hover": { color: "#ff7043" } }}>
              <SearchIcon />
            </IconButton>
            <InputBase
              placeholder="Search recipes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ flex: 1, fontFamily: "Poppins, sans-serif", fontSize: "1rem", color: "#2f2f2f" }}
            />
            {searchQuery && (
              <IconButton onClick={handleClear} sx={{ p: "6px", color: "#6b7280", "&:hover": { color: "#e74c3c" } }}>
                <ClearIcon />
              </IconButton>
            )}
          </SearchBox>
        </Box>

        {isMobile && (
          <Menu anchorEl={menuAnchorEl} open={Boolean(menuAnchorEl)} onClose={handleMenuClose} anchorOrigin={{ vertical: "top", horizontal: "left" }} transformOrigin={{ vertical: "top", horizontal: "left" }}>
            <StyledMenuItem onClick={() => handleMenuItemClick("/")}>Home</StyledMenuItem>
            <StyledMenuItem onClick={() => handleMenuItemClick("/saved-recipe")}>Saved Recipes ({savedRecipes.length})</StyledMenuItem>
            <StyledMenuItem onClick={() => handleMenuItemClick("/about-us")}>About us</StyledMenuItem>
            <StyledMenuItem onClick={() => handleMenuItemClick("/contact-us")}>Contact us</StyledMenuItem>
            {isAuthenticated ? (
              <StyledMenuItem onClick={handleLogout}>Logout</StyledMenuItem>
            ) : (
              <StyledMenuItem onClick={() => { setOpenAuth(true); handleMenuClose(); }}>Login</StyledMenuItem>
            )}
          </Menu>
        )}

        {!isMobile && (
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose} anchorOrigin={{ vertical: "bottom", horizontal: "right" }} transformOrigin={{ vertical: "top", horizontal: "right" }}>
            <StyledMenuItem onClick={handleLogout}>Logout</StyledMenuItem>
          </Menu>
        )}

        <AuthCard open={openAuth} onClose={handleAuthClose} />
      </Box>
    </StyledAppBar>
  );
};

export default Navbar;