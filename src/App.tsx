import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import { ensureAccounts } from "./auth";
import Home from "./Home";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Orders from "./OrdersPage";
import OrderDetails from "./OrderDetails";
import AdminOrders from "./AdminOrders";

export default function App() {
  useEffect(() => {
    ensureAccounts();
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login/:role" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/orders/:id" element={<OrderDetails />} />
      <Route path="/admin/orders" element={<AdminOrders />} />
    </Routes>
  );
}