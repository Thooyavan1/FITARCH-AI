import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { PremiumProvider } from "./context/PremiumContext";
import { AIAssistantProvider } from "./context/AIAssistantContext";
import App from "./App";

// Import global styles (Tailwind + custom)
import "./index.css";

// Ensure there's an HTML element with id="root"
const rootElement = document.getElementById("root") as HTMLElement;

if (!rootElement) {
  throw new Error("Root element not found. Make sure there's a <div id='root'></div> in your index.html.");
}

// Mount the React app to the root
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PremiumProvider>
          <AIAssistantProvider>
            <App />
          </AIAssistantProvider>
        </PremiumProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);
