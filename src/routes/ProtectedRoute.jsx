import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const isUser = localStorage.getItem('login_user')
  if (!isUser) {
    return <Navigate to="/candidate_login" />;
  }

  return children;
};

export default ProtectedRoute;
