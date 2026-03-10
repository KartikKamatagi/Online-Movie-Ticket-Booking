import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { api } from "../services/api";
import { clearAuth, saveAuth } from "../utils/storage";
import UserNavbar from "../components/UserNavbar";
import "./Login.css";

function Login({ onLogin, adminOnly = false }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const data = await api.login(form);
      if (adminOnly && data.role !== "ADMIN") {
        clearAuth();
        onLogin?.(null);
        setError("Only admin accounts can access this page.");
        return;
      }
      saveAuth(data);
      onLogin?.(data);
      const previous = location.state?.from;
      const fromPath = previous?.pathname ? `${previous.pathname}${previous.search || ""}` : null;
      const fallbackPath = data.role === "ADMIN" ? "/admin/dashboard" : "/home";
      navigate(fromPath || fallbackPath, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <UserNavbar navigate={navigate} auth={null} hideActions />
      <div className="login-page has-navbar">
        <div className="login-backdrop" />
        <form className="login-card" onSubmit={submit}>
          <p className="login-brand">FOTX Movies</p>
          <h1>{adminOnly ? "Admin Login" : "Welcome Back"}</h1>
          <p className="login-subtitle">
            {adminOnly
              ? "Sign in with an admin account to access the dashboard."
              : "Sign in to continue booking your favorite movie shows."}
          </p>

          <label htmlFor="email">Email</label>
          <input
            id="email"
            placeholder="you@example.com"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            placeholder="Enter your password"
            type="password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
          {!adminOnly && (
            <p className="register-text">
              New here? <Link to="/register">Create account</Link>
            </p>
          )}
        </form>
      </div>
    </>
  );
}

export default Login;
