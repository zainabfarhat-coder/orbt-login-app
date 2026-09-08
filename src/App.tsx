import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ensureAccounts } from "./auth";
import Home from "./Home";
import Login from "./Login";
import Dashboard from "./Dashboard";

export default function App() {
  useEffect(() => {
    ensureAccounts();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login/:role" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}