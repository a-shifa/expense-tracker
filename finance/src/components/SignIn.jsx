import { useState } from "react";

export default function SignIn({ onSignIn, toSignUp }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (!response.ok || !data.token || !data.user) {
        setError(data.message || "Login failed.");
      } else {
        localStorage.setItem("token", data.token);
        onSignIn(data.user, data.token);
      }
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleDeleteUser() {
    if (!form.email || !form.password) return setError("Enter your email and password to delete account.");
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/auth/delete`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password })
      });
      const result = await response.json();
      if (response.ok) {
        setError("Account deleted. You can register again.");
      } else {
        setError(result.message || "Unable to delete account.");
      }
    } catch {
      setError("Unable to delete account.");
    }
    setLoading(false);
  }

  async function handleForgetPassword() {
    if (!form.email) return setError("Enter your email to reset.");
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email })
      });
      const result = await response.json();
      setError(result.message || "Reset password link sent.");
    } catch {
      setError("Error sending password reset.");
    }
    setLoading(false);
  }

  return (
    <div className="auth-bg fade-in">
      <form className="signin-box" onSubmit={handleSubmit}>
        <h2>Sign In</h2>
        <p className="subtitle">Enter your credentials to access dashboard.</p>
        <div className="form-group">
          <label>Email</label>
          <input
            className="input"
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            placeholder="Enter email"
            required
            autoFocus
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            className="input"
            type="password"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            placeholder="Enter password"
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button className="add-btn" type="submit" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <button
          type="button"
          className="add-btn"
          style={{ marginTop: "10px", background: "#FFE8CD" }}
          onClick={handleForgetPassword}
          disabled={loading}
        >
          Forget Password
        </button>
        <button
          type="button"
          className="cancel-btn"
          style={{ marginTop: "10px" }}
          onClick={handleDeleteUser}
          disabled={loading}
        >
          Delete Account
        </button>
        <div style={{ marginTop: "12px", textAlign: "center" }}>
          <span
            style={{ color: "#2d79c7", cursor: "pointer", fontWeight: "600" }}
            onClick={toSignUp}
          >
            New user? Register here!
          </span>
        </div>
      </form>
    </div>
  );
}