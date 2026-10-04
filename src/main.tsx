import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import { RouterProvider } from "./lib/router";
import "@fontsource/syne/latin-500.css";
import "@fontsource/syne/latin-600.css";
import "@fontsource/manrope/latin-400.css";
import "@fontsource/manrope/latin-500.css";
import "@fontsource/ibm-plex-mono/latin-500.css";
import "./styles.css";
import "./pages.css";

const root = document.getElementById("root");

if (!root) {
  throw new Error("Missing #root element");
}

createRoot(root).render(
  <StrictMode>
    <RouterProvider><App /></RouterProvider>
  </StrictMode>,
);
