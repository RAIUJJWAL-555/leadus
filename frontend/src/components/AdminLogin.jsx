import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/AuthContext.jsx";
import api from "../lib/api.js";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setToken } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { data } = await api.post("/api/auth/login", { email, password });
      setToken(data.token);
      navigate("/admin");
    } catch (err) {
      const raw = err.response?.data?.error ?? err.message ?? "Login failed";
      setError(typeof raw === "string" ? raw : JSON.stringify(raw));
    } finally {
      setLoading(false);
    }
  };

  const field =
    "w-full rounded-xl border border-neutral-800 bg-neutral-900/60 px-4 py-2.5 text-white placeholder:text-neutral-600 outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500 transition-colors text-sm";
  const label = "block mb-1.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider";

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 relative overflow-hidden">
      {/* Background Grid */}
      <div className="pointer-events-none absolute inset-0 grid-bg opacity-35" />

      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-[300px] w-[300px] rounded-full bg-cyan-500/5 blur-[100px] animate-pulse-glow" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-1/4 right-1/4 h-[400px] w-[400px] rounded-full bg-purple-500/5 blur-[120px] animate-pulse-glow" />
      </div>

      <div className="relative z-10 w-full max-w-4xl rounded-3xl border border-neutral-800 bg-[#0a0a0a] shadow-2xl flex flex-col md:flex-row overflow-hidden backdrop-blur-md">
        {/* Left Side: Cat Banner */}
        <div className="relative hidden md:flex md:w-5/12 bg-black flex-col justify-end p-8 overflow-hidden min-h-[400px]">
          {/* Image */}
          <img
            src="/cat.jpg"
            alt="Admin Login Banner"
            className="absolute inset-0 w-full h-full object-cover opacity-75 transition-transform duration-700 hover:scale-105"
          />
          {/* Vignette overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0a0a0a] to-transparent" />

          {/* Banner text content */}
          <div className="relative z-10 space-y-2">
            <h3 className="text-xl font-black text-white leading-tight">
              Admin Workspace.
              <br />
              Manage the Flow.
            </h3>
            <p className="text-xs text-neutral-400">
              Access dashboard tables, export lead metrics, and review inbound prospect forms.
            </p>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-7/12 p-8 md:p-10 bg-[#0c0c0c]/80 flex flex-col justify-center">
          <a
            href="/"
            className="mb-6 inline-flex items-center gap-1.5 text-xs text-neutral-500 transition-colors hover:text-white"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to site
          </a>

          <h1 className="text-2xl font-black tracking-tight text-white mb-1">Admin Login</h1>
          <p className="text-sm text-neutral-500 mb-6">
            Sign in to manage your leads.
          </p>

          {error && (
            <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-xs text-red-400 animate-[fadeIn_0.3s_ease-out]">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="email" className={label}>
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="admin@example.com"
                className={field}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label htmlFor="password" className={label}>
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                className={field}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:opacity-90 active:scale-98 disabled:cursor-not-allowed disabled:opacity-50 mt-2"
            >
              {loading && (
                <svg
                  className="h-4 w-4 animate-spin"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                  />
                </svg>
              )}
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
