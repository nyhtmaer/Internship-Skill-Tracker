import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import App from "./app/App.tsx";
import Login from "./app/components/Login.tsx";
import Register from "./app/components/Register.tsx";
import PrivateRoute from "./app/components/PrivateRoute.tsx";
import Onboarding from "./app/components/Onboarding.tsx";
import OAuthCallback from "./app/components/OAuthCallback.tsx";
import { AuthProvider } from "./app/context/AuthContext.tsx";
import { Toaster } from "sonner";
import "./styles/index.css";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <AuthProvider>
      <Toaster richColors position="top-center" />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        {/* OAuth callback — public route, reads token from query params */}
        <Route path="/oauth/callback" element={<OAuthCallback />} />
        <Route path="/onboarding" element={
          <PrivateRoute>
            <Onboarding />
          </PrivateRoute>
        } />
        <Route path="/*" element={
          <PrivateRoute>
            <App />
          </PrivateRoute>
        } />
      </Routes>
    </AuthProvider>
  </BrowserRouter>
);