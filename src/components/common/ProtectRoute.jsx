import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const PrivateRoute = ({ children, allowedRoles }) => {
    const { loginData } = useSelector((state) => state.auth);

    if (!loginData) {
        // If no login data, redirect to login
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(loginData.role)) {
        // If role doesn’t match, redirect (example: send to dashboard or 404)
        return <Navigate to="/dashboard" replace />;
    }

    // Otherwise, render the protected content
    return children;
};

export default PrivateRoute;
