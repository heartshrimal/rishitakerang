"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <div className="w-full max-w-sm text-center">
          <p className="text-sm text-muted">Invalid reset link.</p>
          <button
            onClick={() => router.push("/admin/login")}
            className="mt-4 text-sm text-accent hover:text-primary transition-colors"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== confirm) {
      setError("Passwords don't match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword: password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to reset password");
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/admin/login"), 2000);
    } catch {
      setError("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <div className="w-full max-w-sm text-center">
          <p className="text-sm text-green-600 font-medium">Password reset successfully!</p>
          <p className="text-sm text-muted mt-2">Redirecting to login...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-5">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl text-text">Reset Password</h1>
          <p className="text-sm text-muted mt-1">Enter your new password</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-text">New Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none focus:border-accent transition-colors"
              required
              minLength={6}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-text">Confirm Password</label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full rounded-xl border border-border bg-surface px-4 py-3 text-sm text-text outline-none focus:border-accent transition-colors"
              required
              minLength={6}
            />
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-text py-3.5 text-background font-medium text-sm hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <button
          onClick={() => router.push("/admin/login")}
          className="mt-4 w-full text-center text-sm text-muted hover:text-text transition-colors"
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-muted text-sm">Loading...</p>
      </div>
    }>
      <ResetPasswordForm />
    </Suspense>
  );
}
