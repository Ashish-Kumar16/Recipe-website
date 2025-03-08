import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = ({ onSearch }) => {
  return (
    <>
      <Navbar onSearch={onSearch} />
      <Outlet />
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
    </>
  );
};

export default Layout;
