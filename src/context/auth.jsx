// src/context/auth.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import api, { setAuthToken } from "../utils/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem("eplacer_auth");
      return raw ? JSON.parse(raw).user : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    try {
      const raw = localStorage.getItem("eplacer_auth");
      return raw ? JSON.parse(raw).token : null;
    } catch {
      return null;
    }
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) setAuthToken(token);
  }, [token]);

  useEffect(() => {
    if (user && token) {
      const data = { user, token };
      localStorage.setItem("eplacer_auth", JSON.stringify(data));

      // ⭐ Fix: also store token where placement pages expect it
      localStorage.setItem("eplacer_token", token);
    } else {
      localStorage.removeItem("eplacer_auth");
      localStorage.removeItem("eplacer_token");
    }
  }, [user, token]);

  async function login(email, password) {
    setLoading(true);
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token: t, user: u } = res.data;

      setToken(t);
      setUser(u);
      setAuthToken(t);

      // Save immediately
      localStorage.setItem("eplacer_token", t);

      return u;
    } catch (err) {
      const message =
        err?.response?.data?.message || err.message || "Login failed";
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setUser(null);
    setToken(null);
    setAuthToken(null);
    localStorage.removeItem("eplacer_auth");
    localStorage.removeItem("eplacer_token");
  }

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
