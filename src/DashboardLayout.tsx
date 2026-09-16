import { NavLink, useNavigate } from "react-router-dom";
import { getSession, logout } from "./auth";
import type { ReactNode } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const session = getSession();
  const isAdmin = session?.role === "admin";

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `block px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
      isActive
        ? "bg-blue-50 text-blue-700"
        : "text-gray-600 hover:bg-gray-100"
    }`;

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Sidebar */}
      <aside className="w-56 bg-white border-r border-gray-200 flex flex-col p-4">
        <div className="flex items-center gap-2 mb-8 px-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
            O
          </div>
          <span className="font-semibold text-gray-900">Orbt</span>
        </div>

        <nav className="flex flex-col gap-1 flex-1">
          <NavLink to="/dashboard" end className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to={isAdmin ? "/admin/orders" : "/orders"} className={linkClass}>
            Orders
          </NavLink>
        </nav>

        <div className="border-t border-gray-200 pt-4 mt-4">
          <p className="text-xs text-gray-400 px-2 mb-2 truncate">
            {session?.email}
          </p>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="w-full text-left px-3 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
          >
            Log out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
