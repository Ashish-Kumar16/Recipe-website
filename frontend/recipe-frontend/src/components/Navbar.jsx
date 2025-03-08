import React, { useState } from "react";
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
  ArrowBack as ArrowBackIcon,
  ArrowForward as ArrowForwardIcon,
} from "@mui/icons-material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../features/authSlice";
import AuthCard from "./AuthCard";

const Navbar = ({ onSearch, totalPages = 1 }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const [menuAnchorEl, setMenuAnchorEl] = useState(null);
  const [openAuth, setOpenAuth] = useState(false);
  const [page, setPage] = useState(1);

  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { data: savedRecipes } = useSelector((state) => state.savedRecipes);
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  // console.log(
  //   "Navbar render - isAuthenticated:",
  //   isAuthenticated,
  //   "user:",
  //   user,
  // );

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery, page);
      setPage(1);
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    onSearch("");
    setPage(1);
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
    if (path === "/home" || path === "/recipes") {
      navigate("/");
    } else {
      navigate(path);
    }
    handleMenuClose();
  };

  const handlePrevious = () => {
    if (page > 1) {
      setPage((prev) => {
        const newPage = prev - 1;
        if (searchQuery.trim()) onSearch(searchQuery, newPage);
        return newPage;
      });
    }
  };

  const handleNext = () => {
    if (page < totalPages) {
      setPage((prev) => {
        const newPage = prev + 1;
        if (searchQuery.trim()) onSearch(searchQuery, newPage);
        return newPage;
      });
    }
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
            flexDirection: "column",
            alignItems: "center",
            paddingTop: 1,
            borderTop: "1px solid lightgray",
            gap: 1,
          }}
        >
          <Box
            component="form"
            onSubmit={handleSearch}
            sx={{
              display: "flex",
              alignItems: "center",
              position: "relative",
              width: isMobile ? "200px" : "300px",
            }}
          >
            <InputBase
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{
                fontSize: "1rem",
                width: "100%",
                borderBottom: "2px solid black",
                paddingBottom: "4px",
              }}
            />
            <IconButton
              type="submit"
              sx={{
                backgroundColor: "#ff7043",
                color: "white",
                position: "absolute",
                right: "-40px",
                "&:hover": { backgroundColor: "#f4511e" },
              }}
            >
              <SearchIcon />
            </IconButton>
            {searchQuery && (
              <IconButton
                onClick={handleClear}
                sx={{ position: "absolute", right: "-80px" }}
              >
                <ClearIcon />
              </IconButton>
            )}
          </Box>

          {isMobile && searchQuery.trim() && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton
                onClick={handlePrevious}
                disabled={page === 1}
                sx={{
                  color: page === 1 ? "grey" : "#ff7043",
                  padding: "4px",
                }}
              >
                <ArrowBackIcon fontSize="medium" />
              </IconButton>
              <Typography variant="body2" sx={{ fontSize: "1rem" }}>
                {page} / {totalPages}
              </Typography>
              <IconButton
                onClick={handleNext}
                disabled={page === totalPages}
                sx={{
                  color: page === totalPages ? "grey" : "#ff7043",
                  padding: "4px",
                }}
              >
                <ArrowForwardIcon fontSize="medium" />
              </IconButton>
            </Box>
          )}
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
            <MenuItem onClick={() => handleMenuItemClick("/about-us")}>
              About us
            </MenuItem>
            <MenuItem onClick={() => handleMenuItemClick("/contact-us")}>
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
