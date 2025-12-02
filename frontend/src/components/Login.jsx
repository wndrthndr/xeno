import { useState } from "react";
import api from "../api";

export default function Login({ onAuth }) {

  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

axios.post(`${BASE_URL}/auth/login`, ...)


  const login = async () => {
    if (!email || !password) {
      setError("Enter email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("tenantId", res.data.tenantId);

      onAuth(res.data.token, res.data.tenantId);

    } catch (err) {
      setError("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950">

      <div className="w-full max-w-md rounded-2xl bg-white/5 backdrop-blur-lg border border-white/10 shadow-2xl p-8">

        <h2 className="text-2xl font-bold text-white text-center mb-2">
          Xeno Insights
        </h2>
        <p className="text-sm text-gray-400 text-center mb-6">
          Sign in to your tenant dashboard
        </p>

        <div className="space-y-4">

          <div>
            <label className="text-xs text-gray-400">Email</label>
            <input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full mt-1 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          <div>
            <label className="text-xs text-gray-400">Password</label>
            <input
              type="password"
              placeholder="••••••"
              value={password}
              onChange={e => setPass(e.target.value)}
              className="w-full mt-1 px-4 py-2.5 rounded-lg bg-slate-900 border border-slate-700 text-white outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-400 text-sm rounded-lg p-2 text-center">
              {error}
            </div>
          )}

          <button
            onClick={login}
            disabled={loading}
            className={`w-full py-2.5 mt-4 rounded-lg text-white font-medium transition-all 
              ${loading 
                ? "bg-slate-600 cursor-not-allowed" 
                : "bg-violet-600 hover:bg-violet-700 active:scale-[0.98]"}
            `}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </div>

        <div className="text-xs text-gray-500 mt-6 text-center">
          Demo accounts available for assignment evaluation
        </div>

      </div>

    </div>
  );
}
