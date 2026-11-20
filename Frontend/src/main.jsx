import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material";
import App from "./App.jsx";

import "./index.css";
import { AuthProvider } from "./Context/AuthContext.jsx";

const theme = createTheme();

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ThemeProvider>
  </BrowserRouter>,
);
