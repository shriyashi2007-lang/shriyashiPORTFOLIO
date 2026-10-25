import React from "react";
import ReactDOM from "react-dom/client";
import "@fontsource/anton/latin-400.css";
import "@fontsource/playfair-display/latin-700.css";
import "@fontsource/playfair-display/latin-400.css";
import "@fontsource/source-serif-4/latin-400.css";
import "@fontsource/inter/latin-400.css";
import "@fontsource/inter/latin-600.css";
import "@fontsource/caveat/latin-500.css";
import App from "./App";
import "./styles/index.css";
import "./styles/theme.css";
ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
