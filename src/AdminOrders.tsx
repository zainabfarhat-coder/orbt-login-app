import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSession } from "./auth";
import {
  getAllOrders,
  updateOrderStatus,
  ensureOrders,
  type OrderWithOwner,
  type OrderStatus,
} from "./orders";
import DashboardLayout from "./DashboardLayout";

const statusStyles: Record<OrderStatus, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-green-50 text-green-700 border-green-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

export default function AdminOrders() {
  const navigate = useNavigate();
  const session = getSession();
  const [orders, setOrders] = useState<OrderWithOwner[]>([]);

  const load = () => {
    // Make sure there's always at least a demo account with orders,
    // so this page never looks empty before any real user logs in.
    ensureOrders("demo@orbt.com");
    setOrders(getAllOrders());
  };

  useEffect(() => {
    if (!session || session.role !== "admin") {
      navigate("/");
      return;
    }
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!session || session.role !== "admin") return null;

  const handleStatus = (order: OrderWithOwner, status: OrderStatus) => {
    updateOrderStatus(order.ownerEmail, order.id, status);
    load();
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              All orders
            </h1>
            <p className="text-sm text-gray-500">
              Orders from every account — approve or reject them here.
            </p>
          </div>
          <button
            onClick={load}
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Refresh
          </button>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left font-medium text-gray-500 px-5 py-3">User</th>
                <th className="text-left font-medium text-gray-500 px-5 py-3">Brand</th>
                <th className="text-left font-medium text-gray-500 px-5 py-3">Date</th>
                <th className="text-left font-medium text-gray-500 px-5 py-3">Total</th>
                <th className="text-left font-medium text-gray-500 px-5 py-3">Status</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={`${order.ownerEmail}-${order.id}`} className="border-b border-gray-100 last:border-0">
                  <td className="px-5 py-3.5 text-gray-900 font-medium">
                    {order.ownerEmail}
                  </td>
                  <td className="px-5 py-3.5 text-gray-900 font-medium">{order.brandName}</td>
                  <td className="px-5 py-3.5 text-gray-600">{order.date}</td>
                  <td className="px-5 py-3.5 text-gray-900 font-medium">
                    ${Number(order.total).toFixed(2)}
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`inline-block text-xs font-medium border rounded-full px-2.5 py-1 capitalize ${statusStyles[order.status]}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right whitespace-nowrap">
                    <button
                      onClick={() => handleStatus(order, "approved")}
                      disabled={order.status === "approved"}
                      className="text-green-600 text-sm font-medium hover:text-green-700 disabled:opacity-30 disabled:cursor-not-allowed mr-3"
                    >
                      Approve
                    </button>
                    <button
                      onClick={() => handleStatus(order, "rejected")}
                      disabled={order.status === "rejected"}
                      className="text-red-600 text-sm font-medium hover:text-red-700 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-gray-400">
                    No orders yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}