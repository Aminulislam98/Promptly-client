"use client";

import { useState } from "react";
import Link from "next/link";
import { Command, Eye, EyeOff, UserPlus } from "lucide-react";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    photoUrl: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    name: "",
    email: "",
    photoUrl: "",
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

  // The submit handler is marked async to allow database/API communication
  const handleSubmit = async (e) => {
    e.preventDefault();
    let valid = true;
    const newErrors = { name: "", email: "", photoUrl: "", password: "" };

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email address is required";
      valid = false;
    }

    if (!formData.photoUrl.trim()) {
      newErrors.photoUrl = "Photo URL is required";
      valid = false;
    }

    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters long";
      valid = false;
    }

    setErrors(newErrors);

    if (valid) {
      setIsLoading(true);
      try {
        // This object bundles the structured information ready for your database collection
        const userDataToSend = {
          name: formData.name,
          email: formData.email,
          photoUrl: formData.photoUrl,
          password: formData.password, // Remember to hash this on your server using bcrypt before saving!
          role: "User", // Requirement: default role must be assigned as User
          subscription: "Free", // Initial signup state configuration
          createdAt: new Date(),
        };

        // ====================================================================
        // SEND THIS DATA TO YOUR DATABASE (MONGODB ATLAS)
        // ====================================================================
        // Example integration using your backend API layer:
        //
        // const response = await fetch("/api/auth/register", {
        //   method: "POST",
        //   headers: { "Content-Type": "application/json" },
        //   body: JSON.stringify(userDataToSend),
        // });
        //
        // const result = await response.json();
        // if (response.ok) { window.location.href = "/login"; }
        // ====================================================================

        console.log(
          "Data successfully packaged for MongoDB payload:",
          userDataToSend,
        );
      } catch (error) {
        console.error("Database transmission error:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <main className="flex min-h-screen w-full items-center justify-center px-4 py-24 bg-page-bg">
      {/* Flat UI Container Card without any shadow classes */}
      <div className="w-full max-w-md rounded-xl border border-brand/30 bg-surface p-6 sm:p-8">
        {/* Branding header alignment */}
        <div className="flex flex-col items-center justify-center text-center">
          <div className="inline-flex h-10 w-10 items-center justify-center rounded-md bg-brand mb-3">
            <Command className="h-6 w-6 text-on-brand" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-text-primary">
            Create your account
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Join Promptly to discover and share amazing AI prompts
          </p>
        </div>

        {/* Form Container */}
        <form
          onSubmit={handleSubmit}
          className="mt-8 flex flex-col gap-5"
          noValidate
        >
          {/* Full Name Field */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="name"
              className="text-sm font-semibold text-text-primary"
            >
              Full Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              className={`w-full h-11 rounded-md border bg-page-bg px-3.5 text-sm text-text-primary placeholder:text-text-secondary/60 transition-colors ${focusRing} ${
                errors.name
                  ? "border-danger focus-visible:ring-danger"
                  : "border-brand/40 hover:border-brand"
              }`}
            />
            {errors.name && (
              <span className="text-xs font-medium text-danger mt-1 pl-1">
                {errors.name}
              </span>
            )}
          </div>

          {/* Email Address Field */}
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

          {/* Photo URL Field */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="photoUrl"
              className="text-sm font-semibold text-text-primary"
            >
              Photo URL
            </label>
            <input
              id="photoUrl"
              name="photoUrl"
              type="url"
              required
              value={formData.photoUrl}
              onChange={handleChange}
              placeholder="https://example.com/your-photo.jpg"
              className={`w-full h-11 rounded-md border bg-page-bg px-3.5 text-sm text-text-primary placeholder:text-text-secondary/60 transition-colors ${focusRing} ${
                errors.photoUrl
                  ? "border-danger focus-visible:ring-danger"
                  : "border-brand/40 hover:border-brand"
              }`}
            />
            {errors.photoUrl && (
              <span className="text-xs font-medium text-danger mt-1 pl-1">
                {errors.photoUrl}
              </span>
            )}
          </div>

          {/* Password Field with Character validation triggers */}
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="password"
              className="text-sm font-semibold text-text-primary"
            >
              Password
            </label>
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

          {/* Submit/Register CTA trigger layout */}
          <button
            type="submit"
            disabled={isLoading}
            className={`mt-2 inline-flex h-11 w-full items-center justify-center gap-2 rounded-md bg-brand text-sm font-semibold text-on-brand transition-all duration-200 hover:bg-brand-hover active:scale-[0.99] disabled:opacity-70 ${focusRing}`}
          >
            <UserPlus className="h-4 w-4" />
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* Footer Navigation Redirection */}
        <div className="mt-6 text-center text-sm">
          <span className="text-text-secondary">Already have an account? </span>
          <Link
            href="/login"
            className={`font-semibold text-brand hover:underline rounded ${focusRing}`}
          >
            Log In
          </Link>
        </div>
      </div>
    </main>
  );
}
