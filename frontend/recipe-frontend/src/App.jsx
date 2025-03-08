import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
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

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading: authLoading } = useSelector(
    (state) => state.auth,
  );
  const [isRestoringAuth, setIsRestoringAuth] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

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

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  if (isRestoringAuth || authLoading) {
    return <NavbarSkeleton />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout onSearch={handleSearch} />}>
          <Route path="/" element={<Home searchQuery={searchQuery} />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route
            path="/search"
            element={<SearchResults searchQuery={searchQuery} />}
          />
          <Route path="/saved-recipe" element={<SavedRecipes />} />
          <Route path="/oauth/callback" element={<OAuthCallback />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
