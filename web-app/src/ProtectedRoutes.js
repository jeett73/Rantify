import React from "react";
// import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
export function ProtectedRouter({ children }) {
  if (!localStorage.getItem("user")) {
    return <Navigate to="/login" replace />;
  } else if (localStorage.getItem("user")) {
    return children;
  }
}