import { useState } from "react";
import api from "../api";

export default function Login({ onAuth }) {

  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
    console.log("LOGIN SENT:", { email, password });

    if (!email || !password) {
      setError("Enter email and password");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });

      console.log("LOGIN OK:", res.data);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("tenantId", res.data.tenantId);

      onAuth(res.data.token, res.data.tenantId);

    } catch (err) {
      console.error("LOGIN ERROR:", err.response?.data || err.message);
      setError(err.response?.data?.error || "Invalid email or password");
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

        <div className="space-y-4">

          <input
            placeholder="xeno@test.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full p-2 rounded bg-slate-800 text-white"
          />

          <input
            type="password"
            placeholder="1234"
            value={password}
            onChange={e => setPass(e.target.value)}
            className="w-full p-2 rounded bg-slate-800 text-white"
          />

          {error && <div style={{color:"red"}}>{error}</div>}

          <button onClick={login} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>

        </div>
      </div>
    </div>
  );
}
