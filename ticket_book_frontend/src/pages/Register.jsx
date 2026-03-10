import { useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../services/api";
import { saveAuth } from "../utils/storage";
import "./Register.css";

function Register({ navigate }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const phoneDigits = form.phone.replace(/\D/g, "");
    if (phoneDigits.length < 10 || phoneDigits.length > 15) {
      setError("Please enter a valid phone number (10 to 15 digits).");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        name: form.name.trim(),
        email: form.email.trim(),
        phone: phoneDigits,
        password: form.password,
      };
      const data = await api.register(payload);
      saveAuth(data);
      navigate("/home");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-backdrop" />
      <form className="register-card" onSubmit={submit}>
        <p className="register-brand">FOTX Movies</p>
        <h1>Create Account</h1>
        <p className="register-subtitle">Sign up to start booking your favorite movie shows.</p>

        <label htmlFor="name">Full Name</label>
        <input
          id="name"
          placeholder="Enter your name"
          value={form.name}
          onChange={(e) => onChange("name", e.target.value)}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          placeholder="you@example.com"
          type="email"
          value={form.email}
          onChange={(e) => onChange("email", e.target.value)}
          required
        />

        <label htmlFor="phone">Phone Number</label>
        <input
          id="phone"
          placeholder="Enter phone number"
          type="tel"
          value={form.phone}
          onChange={(e) => onChange("phone", e.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          id="password"
          placeholder="Enter your password"
          type="password"
          value={form.password}
          onChange={(e) => onChange("password", e.target.value)}
          minLength={6}
          required
        />

        <label htmlFor="confirmPassword">Re-enter Password</label>
        <input
          id="confirmPassword"
          placeholder="Re-enter your password"
          type="password"
          value={form.confirmPassword}
          onChange={(e) => onChange("confirmPassword", e.target.value)}
          minLength={6}
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>
        <p className="register-login-text">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
}

export default Register;
