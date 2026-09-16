import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSession } from "./auth";

export default function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    const session = getSession();
    if (session) navigate("/dashboard");
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="border-b border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white text-sm font-bold">
              O
            </div>
            <span className="font-semibold text-gray-900">Orbt</span>
          </div>
          <button
            onClick={() => navigate("/login/user")}
            className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
          >
            Log in
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 pt-24 pb-20 text-center">
        <span className="inline-block text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 rounded-full px-3 py-1 mb-6">
          B2B payout platform
        </span>

        <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 tracking-tight mb-5">
          One console for your
          <br />
          entire payout workflow
        </h1>

        <p className="text-lg text-gray-500 max-w-xl mx-auto mb-10">
          Manage partners, wallets, and payouts in one place — or check your
          own balance and rewards. Pick the workspace that's yours.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={() => navigate("/login/admin")}
            className="px-6 py-3 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Log in as admin
          </button>

          <button
            onClick={() => navigate("/login/user")}
            className="px-6 py-3 rounded-lg bg-white text-gray-700 text-sm font-medium border border-gray-300 hover:bg-gray-50 transition-colors"
          >
            Log in as user
          </button>
        </div>
      </div>

      
      <div className="border-t border-gray-200 bg-white">
        <div className="max-w-5xl mx-auto px-6 py-14 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 font-semibold">
              1
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Manage partners</h3>
            <p className="text-sm text-gray-500">
              Onboard partners and manage payout rules from one place.
            </p>
          </div>
          <div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 font-semibold">
              2
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Track wallets</h3>
            <p className="text-sm text-gray-500">
              See balances and transaction history in real time.
            </p>
          </div>
          <div>
            <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3 font-semibold">
              3
            </div>
            <h3 className="font-medium text-gray-900 mb-1">Get paid</h3>
            <p className="text-sm text-gray-500">
              Users can view rewards and cash out with a click.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}