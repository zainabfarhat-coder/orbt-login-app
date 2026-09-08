import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSession, logout, type Session } from "./auth";

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
  const eyebrowColor = isAdmin ? "text-[#C7642C]" : "text-[#1D7A5F]";

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7F6] px-4 py-8">
      <div className="w-full max-w-[440px] bg-white border border-[#D8DED9] rounded-xl p-7">
        <div className={`text-[11px] font-semibold mb-2.5 ${eyebrowColor}`}>
          {isAdmin ? "Admin workspace" : "User workspace"}
        </div>
        <h1 className="font-serif text-[26px] m-0 mb-1.5 text-[#10241F]">
          Hello, {name}
        </h1>
        <p className="text-[13.5px] text-[#5B6B63] mb-5">
          Signed in as {session.email}
        </p>

        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="border border-[#D8DED9] rounded-lg px-3.5 py-3">
            <div className="text-[11px] text-[#5B6B63]">Role</div>
            <div className="text-sm font-semibold mt-0.5 text-[#10241F]">
              {isAdmin ? "Administrator" : "Standard user"}
            </div>
          </div>
          <div className="border border-[#D8DED9] rounded-lg px-3.5 py-3">
            <div className="text-[11px] text-[#5B6B63]">Session</div>
            <div className="text-sm font-semibold mt-0.5 text-[#10241F]">
              Active
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="px-3.5 py-2.5 rounded-lg border border-[#D8DED9] bg-transparent text-[13.5px] text-[#10241F] cursor-pointer"
        >
          Log out
        </button>
      </div>
    </div>
  );
}