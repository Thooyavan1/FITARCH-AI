// File: src/App.tsx

import React from "react";
import AppRouter from "./routes/AppRouter";
import "./App.css"; // Make sure this is imported for styling

const App: React.FC = () => {
  return (
    <React.StrictMode>
      <AppRouter />
    </React.StrictMode>
  );
};

export default App;
