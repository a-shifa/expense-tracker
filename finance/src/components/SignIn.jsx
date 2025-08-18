import { useState } from "react";

export default function SignIn({ onSignIn, toSignUp }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch("http://localhost:8001/api/auth/login", {
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
    if (!form.email) return setError("Enter your email to delete account.");
    setLoading(true);
    try {
      await fetch("http://localhost:8001/api/auth/delete", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password })
      });
      setError("Account deleted. You can register again.");
    } catch {
      setError("Unable to delete account.");
    }
    setLoading(false);
  }

  function handleForgetPassword() {
    if (!form.email) return setError("Enter your email to reset.");
    alert("Password reset feature coming soon. Contact admin to reset.");
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
        <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 12 }}>
          <button
            type="button"
            className="add-btn"
            style={{ background: "#FFE8CD", color: "#222" }}
            onClick={handleForgetPassword}
          >
            Forgot Password
          </button>
          <button
            type="button"
            className="cancel-btn"
            onClick={handleDeleteUser}
          >
            Delete Account
          </button>
        </div>
        <div style={{ marginTop: "18px", textAlign: "center" }}>
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