import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";


const NotFound = ({role}) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate("/dashboard")
  }

  return (
    <Box
      sx={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        bgcolor: "#f9fafc",
        px: 2,
      }}
    >
      <Typography variant="h1" fontWeight="bold" color="primary">
        404
      </Typography>
      <Typography variant="h5" gutterBottom>
        Page Not Found
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={3}>
        Oops! The page you are looking for doesn’t exist or has been moved.
      </Typography>
      <Button
        variant="contained"
        size="large"
        onClick={handleNavigate}
      >
        Back to Dashboard
      </Button>
    </Box>
  );
}

export default NotFound