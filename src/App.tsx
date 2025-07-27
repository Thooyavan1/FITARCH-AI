import React from "react";
import "./styles/global.css";
import { AuthProvider } from "./context/AuthContext";
import { AIAssistantProvider } from "./context/AIAssistantContext";
import { PremiumProvider } from "./context/PremiumContext";
import AppRouter from "./routes/AppRouter";

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AIAssistantProvider>
        <PremiumProvider>
          <div className="min-h-screen bg-[#181a20] font-poppins text-white">
            <AppRouter />
          </div>
        </PremiumProvider>
      </AIAssistantProvider>
    </AuthProvider>
  );
};

export default App;
