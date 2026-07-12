"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotSent, setForgotSent] = useState(false);
  const [forgotLoading, setForgotLoading] = useState(false);
  const [showForgot, setShowForgot] = useState(false);
  const router = useRouter();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Login failed");
        return;
      }

      localStorage.setItem("admin_token", data.token);
      router.push("/admin/dashboard");
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleForgotPassword() {
    if (!username) {
      setError("Enter your username first, then click Forgot Password");
      return;
    }
    setForgotLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username }),
      });
      if (res.ok) {
        setForgotSent(true);
      } else {
        setError("Something went wrong");
      }
    } catch {
      setError("Something went wrong");
    } finally {
      setForgotLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl text-text">Admin</h1>
          <p className="text-sm text-muted mt-1">Sign in to manage your store</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none focus:border-accent transition-colors"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none focus:border-accent transition-colors"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}

          {forgotSent ? (
            <p className="text-sm text-green-600">Check your email for a reset link.</p>
          ) : (
            <button
              type="button"
              onClick={handleForgotPassword}
              disabled={forgotLoading}
              className="text-sm text-accent hover:text-primary transition-colors disabled:opacity-50"
            >
              {forgotLoading ? "Sending..." : "Forgot Password?"}
            </button>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-text py-3.5 text-background font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
