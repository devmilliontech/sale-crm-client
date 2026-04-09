import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import "./index.css";
import { CssBaseline, ThemeProvider, createTheme } from "@mui/material";
import { HelmetProvider } from "react-helmet-async";
import { Provider, useSelector } from 'react-redux';
import { store } from './store/store.js';
import { getDesignTokens } from './theme.js'; // function that returns palette based on mode

function Root() {
    const mode = useSelector((state) => state.theme.mode); // get mode from Redux
    const theme = createTheme(getDesignTokens(mode));

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
        </ThemeProvider>
    );
}


createRoot(document.getElementById('root')).render(
    <>
        <Provider store={store}>
            <HelmetProvider>
                <Root />
            </HelmetProvider>
        </Provider>
    </>
);
