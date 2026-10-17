// src/components/ProtectedRoute.js
import React, { useContext } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { user,loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "60vh" }}>
      <div className="spinner" />
      </div>
      );
    }


  if (!user) { 
    return <Navigate to="/login" state={{ from: location}}  replace/>;
}
  // Optionally decode JWT to check role
  // For now, just check presence of token
  return children;
};

export default ProtectedRoute;
