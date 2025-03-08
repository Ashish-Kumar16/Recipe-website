import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import store from "./store/store"; // Ensure this path matches your store file
import App from "./App.jsx";
import "./index.css";
import { fetchUserProfile } from "./features/authSlice"; // Import the thunk to fetch user profile

// Restore authentication state on app load
const token = localStorage.getItem("token");
if (token) {
  // Dispatch fetchUserProfile to validate token and restore auth state
  store.dispatch(fetchUserProfile());
}

// Create root and render the app
ReactDOM.createRoot(document.getElementById("root")).render(
  <Provider store={store}>
    <App />
  </Provider>
);
