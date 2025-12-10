// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("student"); // for autofill UI
  const { login } = useAuth();
  const nav = useNavigate();
  const [loading, setLoading] = useState(false);

  function autofill(type) {
    if (type === "admin") {
      setEmail("admin@eplacer.test");
      setPassword("admin123");
      setMode("admin");
    } else {
      setEmail("student@eplacer.test");
      setPassword("student123");
      setMode("student");
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const u = await login(email.trim(), password);
      if (u.role === "admin") nav("/admin");
      else nav("/");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Login</h2>

      <div className="flex gap-2 mb-4">
        <button
          type="button"
          className={`px-3 py-1 rounded ${mode === "student" ? "bg-primary text-white" : "bg-gray-200"}`}
          onClick={() => autofill("student")}
        >
          Student Login
        </button>

        <button
          type="button"
          className={`px-3 py-1 rounded ${mode === "admin" ? "bg-primary text-white" : "bg-gray-200"}`}
          onClick={() => autofill("admin")}
        >
          Admin Login
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="w-full border px-3 py-2 rounded"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full border px-3 py-2 rounded"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <button
          type="submit"
          className="w-full bg-primary text-white py-2 rounded"
          disabled={loading}
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}
