import { Navigate, Route, Routes } from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";

import Dashboard from "./pages/Dashboard";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Expenses from "./pages/Expenses";
import Income from "./pages/Income";
import Analytics from "./pages/Analytics";
import Forecast from "./pages/Forecast";
import Budgets from "./pages/Budgets";
import Goals from "./pages/Goals";
import Accounts from "./pages/Accounts";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

function ProtectedRoutes() {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return <DashboardLayout />;
}

export default function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected routes */}
      <Route element={<ProtectedRoutes />}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/income" element={<Income />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/forecast" element={<Forecast />} />
        <Route path="/budgets" element={<Budgets />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      {/* Unknown URL */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}