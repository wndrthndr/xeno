import { useState } from "react";
import api from "../api";

export default function Login({ onAuth }) {

  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    const cleanEmail = email.trim().toLowerCase();

    setError("");
    setLoading(true);

    try {
      const res = await api.post("/auth/login", {
        email: cleanEmail,
        password
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("tenantId", res.data.tenantId);

      onAuth(res.data.token, res.data.tenantId);
    } catch (err) {
      setError(err.response?.data?.error || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#0f172a] via-[#020617] to-black px-4">

      <div className="w-full max-w-md rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl p-8">

        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-3xl font-extrabold text-white tracking-tight">
            Xeno Insights
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Sign in to your analytics workspace
          </p>
        </div>

        {/* Form */}
        <div className="space-y-4">

          {/* Email */}
          <div>
            <label className="text-xs text-gray-400">Email</label>
            <input
              placeholder="xeno@test.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-xs text-gray-400">Password</label>
            <input
              type="password"
              placeholder="••••••"
              value={password}
              onChange={e => setPass(e.target.value)}
              className="w-full mt-1 px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
            />
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-2 text-center">
              {error}
            </div>
          )}

          {/* Button */}
          <button
            onClick={login}
            disabled={loading}
            className={`w-full py-3 mt-3 rounded-xl font-semibold text-white transition-all 
              ${loading
                ? "bg-slate-600 cursor-not-allowed"
                : "bg-violet-600 hover:bg-violet-700 active:scale-[0.98]"
              }`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </div>

        {/* Footer */}
        <div className="text-xs text-gray-500 mt-6 text-center">
          Demo Accounts: <span className="text-gray-300">xeno@test.com / 1234</span>
        </div>

      </div>

    </div>
  );
}
