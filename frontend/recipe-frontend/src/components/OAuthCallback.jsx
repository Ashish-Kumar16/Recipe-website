import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setAuth, fetchUserProfile } from "../features/authSlice";
import { parseJwt } from "../utils/jwt";
import { toast } from "react-toastify"; // Import toast

function OAuthCallback() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/oauth/callback") return;

    const urlParams = new URLSearchParams(window.location.search);
    console.log("Full URL:", window.location.href);
    console.log("Query params:", Object.fromEntries(urlParams));
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("token", token);
      const userData = parseJwt(token);
      if (userData) {
        dispatch(setAuth({ token, user: userData }));
        dispatch(fetchUserProfile())
          .unwrap() // Unwrap the promise to handle success/failure
          .then(() => {
            toast.success("Logged in successfully with Google!"); // Show toast on success
            navigate("/", { replace: true });
          })
          .catch((err) => {
            console.error("Profile fetch failed:", err);
            toast.error("Failed to fetch profile after Google login");
            localStorage.removeItem("token");
            navigate("/login");
          });
      } else {
        console.error("Failed to parse token");
        toast.error("Invalid token received");
        localStorage.removeItem("token");
        navigate("/login");
      }
    } else {
      console.warn("No token found in OAuth callback");
      toast.warn("No token received from Google");
      navigate("/");
    }
  }, [navigate, dispatch, location.pathname]);

  return <div>Loading...</div>;
}

export default OAuthCallback;
