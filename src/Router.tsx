import { Routes, Route } from "react-router";
import ProtectedRoute from "./components/ProtectedRoute";
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
        <Route path="/" element={<App />} />
        <Route path="/*" element={<App />} />
      </Route>

      {/* 404 fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}

export default Router;
