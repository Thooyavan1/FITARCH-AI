import React, { Suspense, lazy } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { AIAssistantProvider } from "../context/AIAssistantContext";
import { PremiumProvider } from "../context/PremiumContext";

// Lazy load page components for better performance
const Home = lazy(() => import("../pages/home"));
const Login = lazy(() => import("../pages/Login"));
const Register = lazy(() => import("../pages/Register"));
const Dashboard = lazy(() => import("../pages/Dashboard"));
const UploadVideo = lazy(() => import("../pages/UploadVideo"));
const PremiumPlans = lazy(() => import("../pages/PremiumPlans"));
const NotFound = lazy(() => import("../pages/NotFound"));

// Loading component
const LoadingSpinner: React.FC = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
  </div>
);

// Protected Route component
interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Main Router component
const AppRouter: React.FC = () => {
  return (
    <AuthProvider>
      <AIAssistantProvider>
        <PremiumProvider>
          <BrowserRouter>
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Public routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <Dashboard />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/upload"
                  element={
                    <ProtectedRoute>
                      <UploadVideo />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/premium"
                  element={
                    <ProtectedRoute>
                      <PremiumPlans />
                    </ProtectedRoute>
                  }
                />

                {/* Catch all route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          </BrowserRouter>
        </PremiumProvider>
      </AIAssistantProvider>
    </AuthProvider>
  );
};

export default AppRouter;
