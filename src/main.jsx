import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./styles.css";
import "./homepage.css";
import "./site-corrections.css";
import "./nigeria-enterprise.css";
document.documentElement.dataset.site = ["bluelinkconsults.ng", "www.bluelinkconsults.ng"].includes(window.location.hostname) ? "nigeria" : "international";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>
);
