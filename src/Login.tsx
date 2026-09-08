import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { login, type Role } from "./auth";

export default function Login() {
  const { role } = useParams<{ role: Role }>();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const label = role === "admin" ? "Admin" : "User";
  const seedHint =
    role === "admin" ? "admin@orbt.com / admin123" : "user@orbt.com / user123";
  const eyebrowColor = role === "admin" ? "text-[#C7642C]" : "text-[#1D7A5F]";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!role) return;
    const result = login(role, email, password);
    if (result.error) {
      setError(result.error);
      return;
    }
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F5F7F6] px-4 py-8">
      <div className="w-full max-w-[440px]">
        <button
          onClick={() => navigate("/")}
          className="block text-[13px] text-[#5B6B63] mb-6 bg-transparent border-none cursor-pointer p-0"
        >
          ← back
        </button>

        <div className="mb-6">
          <div className={`text-[11px] font-semibold mb-1.5 ${eyebrowColor}`}>
            {label} sign-in
          </div>
          <h1 className="font-serif text-2xl m-0 text-[#10241F]">
            Welcome back
          </h1>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <label className="text-[13px] text-[#5B6B63]">
            Email
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={seedHint.split(" / ")[0]}
              className="block w-full mt-1.5 px-3 py-[11px] rounded-lg border border-[#D8DED9] text-sm"
            />
          </label>

          <label className="text-[13px] text-[#5B6B63]">
            Password
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="block w-full mt-1.5 px-3 py-[11px] rounded-lg border border-[#D8DED9] text-sm"
            />
          </label>

          {error && <div className="text-[13px] text-[#B3261E]">{error}</div>}

          <button
            type="submit"
            className="mt-2 px-4 py-3 rounded-lg border-none bg-[#10241F] text-[#F5F7F6] text-sm font-semibold cursor-pointer"
          >
            Log in
          </button>
        </form>

        <p className="text-xs text-[#5B6B63] mt-4">Demo account — {seedHint}</p>
      </div>
    </div>
  );
}