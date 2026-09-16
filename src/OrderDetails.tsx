import { useNavigate, useParams } from "react-router-dom";
import { getOrderById } from "./orders";
import { getSession } from "./auth";
import DashboardLayout from "./DashboardLayout";

export default function OrderDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const session = getSession();

  if (!session) {
    navigate("/");
    return null;
  }

  const order = id ? getOrderById(session.email, id) : undefined;

  if (!order) {
    return (
      <DashboardLayout>
        <div className="max-w-2xl">
          <button
            onClick={() => navigate("/orders")}
            className="text-sm text-gray-500 mb-6"
          >
            ← back to orders
          </button>
          <p className="text-gray-500">Order not found.</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-xl">
        <button
          onClick={() => navigate("/orders")}
          className="text-sm text-gray-500 mb-6 hover:text-gray-700"
        >
          ← back to orders
        </button>

        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          {order.brandName}
        </h1>
        <p className="text-sm text-gray-500 mb-6">Order #{order.id}</p>

        <div className="bg-white border border-gray-200 rounded-xl divide-y divide-gray-100">
          <div className="flex justify-between px-5 py-4">
            <span className="text-sm text-gray-500">Brand</span>
            <span className="text-sm font-medium text-gray-900">
              {order.brandName}
            </span>
          </div>
          <div className="flex justify-between px-5 py-4">
            <span className="text-sm text-gray-500">Date</span>
            <span className="text-sm font-medium text-gray-900">
              {order.date}
            </span>
          </div>
          <div className="flex justify-between px-5 py-4">
            <span className="text-sm text-gray-500">Price</span>
            <span className="text-sm font-medium text-gray-900">
              ${order.price.toFixed(2)}
            </span>
          </div>
          <div className="flex justify-between px-5 py-4">
            <span className="text-sm text-gray-500">Quantity</span>
            <span className="text-sm font-medium text-gray-900">
              {order.quantity}
            </span>
          </div>
          <div className="flex justify-between px-5 py-4">
            <span className="text-sm text-gray-500">Total</span>
            <span className="text-sm font-semibold text-gray-900">
              ${order.total.toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}