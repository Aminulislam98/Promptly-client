"use client";

import { useState } from "react";
import Link from "next/link";
import { Command, Eye, EyeOff, LogIn } from "lucide-react";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}

export default function SignInPage() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    const newErrors = { email: "", password: "" };

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
      valid = false;
    }
    if (!formData.password) {
      newErrors.password = "Password is required";
      valid = false;
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      setIsLoading(true);
      try {
        const credentialsToVerify = {
          email: formData.email,
          password: formData.password,
        };
        console.log(
          "Credentials bundled for server-side verification:",
          credentialsToVerify,
        );
      } catch (error) {
        console.error("Authentication submission error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const inputBase =
    "w-full rounded-lg border-0 bg-surface-hover px-4 text-base text-text-primary placeholder:text-text-muted outline-none ring-1 ring-border transition-all duration-150 focus:ring-2 focus:ring-brand h-12";

  return (
    <main className="flex min-h-screen items-center justify-center bg-page-bg px-4 py-24">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-3">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand">
            <Command className="h-6 w-6 text-on-brand" />
          </span>
          <div className="text-center">
            <h1 className="text-2xl font-bold leading-tight text-text-primary">
              Welcome back
            </h1>
            <p className="mt-1 text-base text-text-secondary">
              Sign in to your Promptly account
            </p>
          </div>
        </div>

        {/* Card */}
        <div className="rounded-2xl bg-surface px-6 py-8 sm:px-8">
          {/* Google login */}
          <button
            type="button"
            className={
              "flex h-12 w-full items-center justify-center gap-3 rounded-lg border bg-surface text-base font-medium text-text-primary transition-colors duration-150 hover:bg-surface-hover active:scale-[0.98] " +
              focusRing
            }
          >
            <GoogleIcon />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <span className="h-px flex-1 bg-border" />
            <span className="text-base text-text-secondary">or</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-5"
            noValidate
          >
            {/* Email */}
            <div className="flex flex-col gap-1.5">
              <label
                htmlFor="email"
                className="text-base font-medium text-text-primary"
              >
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className={
                  inputBase +
                  (errors.email ? " ring-error focus:ring-error" : "")
                }
              />
              {errors.email && (
                <p className="text-base text-error">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="text-base font-medium text-text-primary"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className={
                    "text-base font-medium text-brand hover:underline rounded " +
                    focusRing
                  }
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={
                    inputBase +
                    " pr-12" +
                    (errors.password ? " ring-error focus:ring-error" : "")
                  }
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className={
                    "absolute right-3 top-1/2 -translate-y-1/2 rounded p-1 text-text-secondary transition-colors duration-150 hover:text-text-primary " +
                    focusRing
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-base text-error">{errors.password}</p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className={
                "mt-1 flex h-12 w-full items-center justify-center gap-2 rounded-lg bg-brand text-base font-semibold text-on-brand transition-all duration-200 hover:bg-brand-hover active:scale-[0.98] disabled:opacity-60 " +
                focusRing
              }
            >
              <LogIn className="h-5 w-5" />
              {isLoading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        {/* Register link */}
        <p className="mt-6 text-center text-base text-text-secondary">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className={
              "font-semibold text-brand hover:underline rounded " + focusRing
            }
          >
            Create one
          </Link>
        </p>
      </div>
    </main>
  );
}
