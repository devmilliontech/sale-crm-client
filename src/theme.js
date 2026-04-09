// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "'Montserrat', sans-serif",
  },
});

export default theme;

export const getDesignTokens = (mode) => ({
  palette: {
    mode,
    ...(mode === "light"
      ? {
        // light mode palette
        primary: { main: "#1976d2" },
        background: { default: "#f9fafc", paper: "#fff" },
      }
      : {
        // dark mode palette
        primary: { main: "#90caf9" },
        background: { default: "#121212", paper: "#1d1d1d" },
        text: { primary: "#fff", secondary: "#ccc" },
      }),
  },
});