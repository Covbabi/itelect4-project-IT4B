import { Navigate, Route, Routes } from "react-router";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";
import LoginPage from "./pages/LoginPage";
import App from "./App";
import NotFoundPage from "./pages/NotFoundPage";

function Router() {
  return (
    <Routes>
      {/* Public route - Login page */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected route - Main app */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          <Route path="/" element={<App />} />
          <Route path="/*" element={<App />} />
        </Route>
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<Navigate to="/login" replace />} />
      <Route path="/not-found" element={<NotFoundPage />} />
    </Routes>
  );
}

export default Router;
