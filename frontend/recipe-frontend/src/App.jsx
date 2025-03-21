import React, { useEffect, useState } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuth, fetchUserProfile, logout } from "./features/authSlice";
import Home from "./pages/Home";
import RecipeDetail from "./pages/ReceipeDetailPage";
import SearchResults from "./pages/SearchResults";
import SavedRecipes from "./pages/SavedRecipePage";
import OAuthCallback from "./components/OAuthCallback";
import NavbarSkeleton from "./components/NavbarSkeleton";
import Layout from "./components/Layout";
import { parseJwt } from "./utils/jwt";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import About from "./pages/About";
import Contact from "./pages/Contact";

const AppContent = ({ searchQuery, onSearch }) => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading: authLoading } = useSelector(
    (state) => state.auth,
  );
  const [isRestoringAuth, setIsRestoringAuth] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const restoreAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const userData = parseJwt(token);
        if (userData) {
          dispatch(setAuth({ token, user: userData }));
          try {
            await dispatch(fetchUserProfile()).unwrap();
          } catch (err) {
            dispatch(logout());
          }
        } else {
          dispatch(logout());
        }
      }
      setIsRestoringAuth(false);
    };
    restoreAuth();
  }, [dispatch]);

  useEffect(() => {
    // Handle search query from navigation state
    if (location.state?.searchQuery) {
      onSearch(location.state.searchQuery);
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate, onSearch]);

  if (isRestoringAuth || authLoading) {
    return <NavbarSkeleton />;
  }

  return (
    <Routes>
      <Route element={<Layout onSearch={onSearch} />}>
        <Route path="/" element={<Home searchQuery={searchQuery} />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route
          path="/search"
          element={<SearchResults searchQuery={searchQuery} />}
        />
        <Route path="/saved-recipe" element={<SavedRecipes />} />
        <Route path="/about-us" element={<About />} />
        <Route path="/contact-us" element={<Contact />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
      </Route>
    </Routes>
  );
};

const App = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  return (
    <BrowserRouter>
      <Navbar onSearch={handleSearch} />
      <AppContent searchQuery={searchQuery} onSearch={handleSearch} />
      <Footer />
    </BrowserRouter>
  );
};

export default App;
