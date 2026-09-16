import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSession, type Session } from "./auth";
import DashboardLayout from "./DashboardLayout";

export default function Dashboard() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const s = getSession();
    if (!s) {
      navigate("/");
      return;
    }
    setSession(s);
  }, [navigate]);

  if (!session) return null;

  const name = session.email.split("@")[0];
  const isAdmin = session.role === "admin";

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <span className="inline-block text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-md px-2.5 py-1 mb-3 capitalize">
          {isAdmin ? "Admin" : "User"}
        </span>

        <h1 className="text-2xl font-semibold text-gray-900 mb-1">
          Hello, {name}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          {isAdmin
            ? "Here's a quick overview of your partner console."
            : "Here's a quick overview of your account."}
        </p>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <p className="text-sm text-gray-500 mb-1">Signed in as</p>
          <p className="text-sm font-medium text-gray-900 mb-4">
            {session.email}
          </p>
          <p className="text-sm text-gray-500">
            Use the sidebar to check your orders.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}