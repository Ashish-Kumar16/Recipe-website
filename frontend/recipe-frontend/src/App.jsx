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
import Navbar from "./components/Navbar"; // Ensure path is correct
import NavbarSkeleton from "./components/NavbarSkeleton";

const App = () => {
  const dispatch = useDispatch();
  const { isAuthenticated, loading: authLoading } = useSelector((state) => state.auth);
  const [isRestoringAuth, setIsRestoringAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("App useEffect - Token:", token, "isAuthenticated:", isAuthenticated);
    if (token && !isAuthenticated) {
      const userData = parseJwt(token);
      if (userData) {
        dispatch(setAuth({ token, user: userData }));
        dispatch(fetchUserProfile())
          .unwrap()
          .then(() => console.log("Profile fetch succeeded"))
          .catch((err) => console.error("Profile fetch failed:", err))
          .finally(() => setIsRestoringAuth(false));
      } else {
        setIsRestoringAuth(false);
      }
    } else {
      setIsRestoringAuth(false);
    }
  }, [dispatch, isAuthenticated]);

  if (isRestoringAuth || authLoading) {
    return <NavbarSkeleton />;
  }

  return (
    <BrowserRouter>
      <Navbar onSearch={(query) => console.log(query)} />
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
