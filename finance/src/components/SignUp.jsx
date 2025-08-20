import { useState } from "react";

export default function SignUp({ onSignUp, toSignIn }) {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;


  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      const data = await response.json();
      if (!response.ok || !data.token || !data.user) {
        setError(data.message || "Signup failed.");
      } else {
        localStorage.setItem("token", data.token);
        onSignUp(data.user, data.token);
      }
    } catch {
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-bg fade-in">
      <form className="signin-box" onSubmit={handleSubmit}>
        <h2>Sign Up</h2>
        <p className="subtitle">Create your account.</p>
        <div className="form-group">
          <label>Name</label>
          <input
            className="input"
            type="text"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Your name"
            required
            autoFocus
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            className="input"
            type="email"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            placeholder="Email"
            required
          />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input
            className="input"
            type="password"
            value={form.password}
            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
            placeholder="Password"
            required
          />
        </div>
        {error && <div className="error">{error}</div>}
        <button className="add-btn" type="submit" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        <div style={{marginTop:"12px",textAlign:"center"}}>
          <span
            style={{color:"#2d79c7",cursor:"pointer",fontWeight:"600"}}
            onClick={toSignIn}
          >
            Already have an account? Sign in
          </span>
        </div>
      </form>
    </div>
  );
}