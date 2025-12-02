import { useState } from "react";
import api from "../api";

export default function Login({ onAuth }) {

  const [email, setEmail] = useState("");
  const [password, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const login = async () => {
  const cleanEmail = email.trim().toLowerCase();

  try {
    const res = await api.post("/auth/login", {
      email: cleanEmail,
      password
    });

    localStorage.setItem("token", res.data.token);
    localStorage.setItem("tenantId", res.data.tenantId);

    onAuth(res.data.token, res.data.tenantId);
  } catch (err) {
    setError(err.response?.data?.error || "Login failed");
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

          <button
  onClick={login}
  disabled={loading}
  className="w-full py-2 mt-3 rounded bg-violet-600 text-white font-semibold hover:bg-violet-700 disabled:bg-gray-600 transition"
>
  {loading ? "Signing in..." : "Sign In"}
</button>


        </div>
      </div>
    </div>
  );
}
