import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setAuth, fetchUserProfile } from "./features/authSlice";
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

  useEffect(() => {
    const restoreAuth = async () => {
      const token = localStorage.getItem("token");
      console.log(
        "App useEffect - Token:",
        token,
        "isAuthenticated:",
        isAuthenticated,
      );
      if (token) {
        const userData = parseJwt(token);
        if (userData) {
          dispatch(setAuth({ token, user: userData }));
          try {
            await dispatch(fetchUserProfile()).unwrap();
            console.log("Profile fetch succeeded");
          } catch (err) {
            console.error("Profile fetch failed:", err);
            dispatch(logout()); // Logout if profile fetch fails
          }
        }
      }
      setIsRestoringAuth(false);
    };

    restoreAuth();
  }, [dispatch]);

  const handleSearch = (query, page) => {
    console.log("App handleSearch - Query:", query, "Page:", page);
    // Logic to update Home's search state can be added here if needed
  };

  if (isRestoringAuth || authLoading) {
    return <NavbarSkeleton />;
  }

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
