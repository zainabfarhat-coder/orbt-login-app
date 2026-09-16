import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getOrders, addOrder, ensureOrders, type Order, type OrderStatus } from "./orders";
import { getSession } from "./auth";
import DashboardLayout from "./DashboardLayout";

const statusStyles: Record<OrderStatus, string> = {
  pending: "bg-amber-50 text-amber-700 border-amber-200",
  approved: "bg-green-50 text-green-700 border-green-200",
  rejected: "bg-red-50 text-red-700 border-red-200",
};

export default function OrdersPage() {
  const navigate = useNavigate();
  const session = getSession();
  const [orders, setOrders] = useState<Order[]>([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [formError, setFormError] = useState("");

  const loadOrders = () => {
    if (!session) return;
    ensureOrders(session.email);
    setOrders(getOrders(session.email));
  };

  useEffect(() => {
    if (!session) {
      navigate("/");
      return;
    }
    loadOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleAddOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    const priceNum = Number(price);
    const qtyNum = Number(quantity) || 1;

    if (!brandName.trim()) {
      setFormError("Enter a brand name.");
      return;
    }
    if (!price || isNaN(priceNum) || priceNum <= 0) {
      setFormError("Enter a valid price (numbers only).");
      return;
    }
    if (!session) return;

    addOrder(session.email, brandName.trim(), priceNum, qtyNum);
    setBrandName("");
    setPrice("");
    setQuantity("1");
    setShowAddForm(false);
    loadOrders();
  };

  if (!session) return null;

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 mb-1">
              Orders
            </h1>
            <p className="text-sm text-gray-500">
              Orders placed by {session.email}.
            </p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={loadOrders}
              className="px-4 py-2 rounded-lg border border-gray-300 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Refresh
            </button>
            <button
              onClick={() => setShowAddForm((v) => !v)}
              className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
            >
              Add order
            </button>
          </div>
        </div>

        {showAddForm && (
          <form
            onSubmit={handleAddOrder}
            autoComplete="off"
            className="bg-white border border-gray-200 rounded-xl p-5 mb-6 flex flex-col gap-3"
          >
            <div className="flex flex-col sm:flex-row gap-3 items-start">
              <div className="flex-1 w-full">
                <label className="text-xs font-medium text-gray-600 mb-1 block">
                  Brand name
                </label>
                <input
                  name="order-brand-name"
                  autoComplete="off"
                  required
                  value={brandName}
                  onChange={(e) => setBrandName(e.target.value)}
                  placeholder="Nike"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                />
              </div>
              <div className="w-full sm:w-28">
                <label className="text-xs font-medium text-gray-600 mb-1 block">
                  Price
                </label>
                <input
                  name="order-price"
                  autoComplete="off"
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="45"
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                />
              </div>
              <div className="w-full sm:w-24">
                <label className="text-xs font-medium text-gray-600 mb-1 block">
                  Qty
                </label>
                <input
                  name="order-qty"
                  autoComplete="off"
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-300 text-sm"
                />
              </div>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors whitespace-nowrap mt-1 sm:mt-5"
              >
                Save order
              </button>
            </div>

            {formError && (
              <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">
                {formError}
              </p>
            )}
          </form>
        )}

        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left font-medium text-gray-500 px-5 py-3">
                  Brand
                </th>
                <th className="text-left font-medium text-gray-500 px-5 py-3">
                  Date
                </th>
                <th className="text-left font-medium text-gray-500 px-5 py-3">
                  Price
                </th>
                <th className="text-left font-medium text-gray-500 px-5 py-3">
                  Qty
                </th>
                <th className="text-left font-medium text-gray-500 px-5 py-3">
                  Total
                </th>
                <th className="text-left font-medium text-gray-500 px-5 py-3">
                  Status
                </th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-5 py-3.5 text-gray-900 font-medium">
                    {order.brandName}
                  </td>
                  <td className="px-5 py-3.5 text-gray-600">{order.date}</td>
                  <td className="px-5 py-3.5 text-gray-600">
                    ${Number(order.price).toFixed(2)}
                  </td>
                  <td className="px-5 py-3.5 text-gray-600">
                    {order.quantity}
                  </td>
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
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => navigate(`/orders/${order.id}`)}
                      className="text-blue-600 text-sm font-medium hover:text-blue-700"
                    >
                      View more details
                    </button>
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-5 py-8 text-center text-gray-400">
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