"use client";

import { useState } from "react";
import Link from "next/link";
import { Command, Eye, EyeOff, LogIn } from "lucide-react";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg";

export default function SignInPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear field error on keystroke
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
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
        // ====================================================================
        // PACKAGING CREDENTIAL PAYLOAD FOR MONGODB / AUTHENTICATION CHECK
        // ====================================================================
        const credentialsToVerify = {
          email: formData.email,
          password: formData.password,
        };

        // ====================================================================
        // VERIFY THIS DATA WITH MONGODB ATLAS
        // ====================================================================
        // 1. Send credentialsToVerify to your login API route.
        // 2. Fetch the user profile from your MongoDB cluster via their email.
        // 3. Compare passwords using bcrypt.compare() on your server.
        // 4. Return user info along with their database 'role' (Admin or User)
        //    packaged within a JWT token to protect your routes.
        //
        // Example Route Call:
        // const response = await fetch("/api/auth/login", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify(credentialsToVerify),
        // });
        //
        // const result = await response.json();
        // if (response.ok) {
        //   // Redirect securely based on MongoDB dynamic role assignment:
        //   if (result.user.role === "Admin") {
        //      window.location.href = "/admin/dashboard";
        //   } else {
        //      window.location.href = "/dashboard";
        //   }
        // }
        // ====================================================================

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

  return (
    <main className="flex min-h-screen w-full items-center justify-center px-4 py-24 bg-page-bg">
      {/* Container - Completely flat, NO SHADOWS applied, aligned with Navbar colors */}
      <div className="w-full max-w-md rounded-xl border border-brand/30 bg-surface p-6 sm:p-8">
        {/* Header Branding */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand mb-3">
            <Command className="h-6 w-6 text-on-brand" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Welcome back
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Log in to access your dashboard and custom prompts
          </p>
        </div>

        {/* Login Form */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col gap-5"
          noValidate
        >
          {/* Email Address Input */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="email"
              className="text-sm font-semibold text-text-primary"
            >
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className={`w-full h-11 rounded-md border bg-page-bg px-3.5 text-sm text-text-primary placeholder:text-text-secondary/60 transition-colors ${focusRing} ${
                errors.email
                  ? "border-danger focus-visible:ring-danger"
                  : "border-brand/40 hover:border-brand"
              }`}
            />
            {errors.email && (
              <span className="text-xs font-medium text-danger mt-1 pl-1">
                {errors.email}
              </span>
            )}
          </div>

          {/* Password Input (with Hero UI-style character error support) */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label
                htmlFor="password"
                className="text-sm font-semibold text-text-primary"
              >
                Password
              </label>
              {/* Optional: Add a stylized link if password resets are implemented */}
              <Link
                href="/forgot-password"
                className={`text-xs font-semibold text-brand hover:underline rounded ${focusRing}`}
              >
                Forgot password?
              </Link>
            </div>
            <div className="relative w-full">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full h-11 rounded-md border bg-page-bg pl-3.5 pr-10 text-sm text-text-primary placeholder:text-text-secondary/60 transition-colors ${focusRing} ${
                  errors.password
                    ? "border-danger focus-visible:ring-danger"
                    : "border-brand/40 hover:border-brand"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary focus:outline-none"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <span className="text-xs font-medium text-danger mt-1 pl-1">
                {errors.password}
              </span>
            )}
          </div>

          {/* Form CTA Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className={`mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-brand text-sm font-semibold text-on-brand transition-all duration-200 hover:bg-brand-hover active:scale-[0.99] disabled:opacity-70 ${focusRing}`}
          >
            <LogIn className="h-4 w-4" />
            {isLoading ? "Signing In..." : "Sign In"}
          </button>
        </form>

        {/* Alternate Navigation Redirect */}
        <div className="mt-6 text-center text-sm">
          <span className="text-text-secondary">
            Don&apos;t have an account?{" "}
          </span>
          <Link
            href="/register"
            className={`font-semibold text-brand hover:underline rounded ${focusRing}`}
          >
            Register here
          </Link>
        </div>
      </div>
    </main>
  );
}
