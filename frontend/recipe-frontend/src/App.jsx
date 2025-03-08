import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import { setAuth, fetchUserProfile } from "./features/authSlice";
import Home from "./pages/Home";
import RecipeDetail from "./pages/ReceipeDetailPage";
import SearchResults from "./pages/SearchResults";
import SavedRecipes from "./pages/SavedRecipePage";
import OAuthCallback from "./components/OAuthCallback";
import { parseJwt } from "./utils/jwt";
import NavbarSkeleton from "./components/NavbarSkeleton"; // Add this for loading state

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading: authLoading } = useSelector((state) => state.auth);
  const [isRestoringAuth, setIsRestoringAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token && !isAuthenticated) {
      const userData = parseJwt(token);
      if (userData) {
        // Set initial auth state from token
        dispatch(setAuth({ token, user: userData }));
        // Validate with backend
        dispatch(fetchUserProfile()).finally(() => {
          setIsRestoringAuth(false); // Resolve loading state after fetch completes
        });
      } else {
        setIsRestoringAuth(false); // Invalid token, no need to wait
      }
    } else {
      setIsRestoringAuth(false); // No token or already authenticated
    }
  }, [dispatch, isAuthenticated]);

  // Show loading state until auth is fully restored
  if (isRestoringAuth || authLoading) {
    return <NavbarSkeleton />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/recipe/:id" element={<RecipeDetail />} />
        <Route path="/search" element={<SearchResults />} />
        <Route path="/saved-recipe" element={<SavedRecipes />} />
        <Route path="/oauth/callback" element={<OAuthCallback />} />
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={1000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </BrowserRouter>
  );
};

export default App;
