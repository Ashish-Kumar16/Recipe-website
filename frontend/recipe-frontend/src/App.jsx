import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // Should work with Vite
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
  const {
    isAuthenticated,
    loading: authLoading,
    error,
  } = useSelector((state) => state.auth);
  const [isRestoringAuth, setIsRestoringAuth] = useState(true);

  useEffect(() => {
    const restoreAuth = async () => {
      const token = localStorage.getItem("token");
      // console.log("[App] Token found:", token ? "Yes" : "No");
      if (token) {
        const userData = parseJwt(token);
        // console.log("[App] Parsed JWT:", userData);
        if (userData) {
          dispatch(setAuth({ token, user: userData }));
          try {
            const result = await dispatch(fetchUserProfile()).unwrap();
            // console.log("[App] Profile fetch succeeded:", result);
          } catch (err) {
            // console.error("[App] Profile fetch failed:", err);
            // console.log("[App] Using JWT data as fallback:", userData);
          }
        } else {
          // console.warn("[App] Invalid JWT data");
          dispatch(logout());
        }
      } else {
        // console.log("[App] No token, skipping auth restoration");
      }
      setIsRestoringAuth(false);
    };

    restoreAuth();
  }, [dispatch]);

  const handleSearch = (query, page) => {
    // console.log("[App] Search - Query:", query, "Page:", page);
  };

  if (isRestoringAuth || authLoading) {
    // console.log(
    //   "[App] Rendering skeleton - isRestoringAuth:",
    //   isRestoringAuth,
    //   "authLoading:",
    //   authLoading,
    // );
    return <NavbarSkeleton />;
  }

  // console.log(
  //   "[App] Rendering app - isAuthenticated:",
  //   isAuthenticated,
  //   "error:",
  //   error,
  // );

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout onSearch={handleSearch} />}>
          <Route path="/" element={<Home />} />
          <Route path="/recipe/:id" element={<RecipeDetail />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/saved-recipe" element={<SavedRecipes />} />
          <Route path="/oauth/callback" element={<OAuthCallback />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
