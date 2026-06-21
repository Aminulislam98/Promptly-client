"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import toast, { Toaster } from "react-hot-toast";

const focusRing =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-page-bg";

const inputBase =
  "w-full h-12 rounded-full border-0 bg-surface-hover px-5 text-base text-text-primary placeholder:text-text-muted outline-none ring-1 ring-border transition-all duration-150 focus:ring-2 focus:ring-brand";

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

export default function SignupPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectParam = searchParams.get("redirect");
  const redirectTo = redirectParam || "/dashboard";

  // Forward the same redirect to the login page so it survives the switch
  const loginHref = redirectParam
    ? `/login?redirect=${encodeURIComponent(redirectParam)}`
    : "/login";

  const { data: session, isPending } = authClient.useSession();

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

  // Already logged in → redirect
  useEffect(() => {
    if (!isPending && session?.user) {
      router.replace(redirectTo);
    }
  }, [session, isPending, router, redirectTo]);

  if (isPending || session?.user) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

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
      newErrors.password = "Password must be at least 8 characters";
      valid = false;
    }

    setErrors(newErrors);
    if (!valid) {
      const firstError = Object.values(newErrors).find((e) => e !== "");
      toast.error(firstError);
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await authClient.signUp.email({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        image: formData.photoUrl,
      });

      if (error) {
        toast.error(error.message || "Registration failed. Please try again.");
      } else {
        toast.success("Account created successfully!");
        router.replace(redirectTo);
      }
    } catch {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (redirectParam) {
      try {
        sessionStorage.setItem("postLoginRedirect", redirectParam);
      } catch {}
    }
    await authClient.signIn.social({
      provider: "google",
      callbackURL: `${window.location.origin}/auth/callback`,
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-surface px-4 pb-16 pt-24">
      <Toaster position="top-center" />
      <div className="w-full max-w-md">
        <div className="mb-8">
          <h1 className="text-3xl font-bold leading-tight text-text-primary">
            Create Account
          </h1>
          <p className="mt-1 text-base text-text-secondary">
            Join Promptly today
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3"
          noValidate
        >
          <div>
            <input
              id="name"
              name="name"
              type="text"
              autoComplete="name"
              required
              value={formData.name}
              onChange={handleChange}
              placeholder="Full name"
              className={
                inputBase + (errors.name ? " ring-error focus:ring-error" : "")
              }
            />
            {errors.name && (
              <p className="mt-1 pl-4 text-base text-error">{errors.name}</p>
            )}
          </div>

          <div>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="Email address"
              className={
                inputBase + (errors.email ? " ring-error focus:ring-error" : "")
              }
            />
            {errors.email && (
              <p className="mt-1 pl-4 text-base text-error">{errors.email}</p>
            )}
          </div>

          <div>
            <input
              id="photoUrl"
              name="photoUrl"
              type="url"
              autoComplete="url"
              required
              value={formData.photoUrl}
              onChange={handleChange}
              placeholder="Photo URL"
              className={
                inputBase +
                (errors.photoUrl ? " ring-error focus:ring-error" : "")
              }
            />
            {errors.photoUrl && (
              <p className="mt-1 pl-4 text-base text-error">
                {errors.photoUrl}
              </p>
            )}
          </div>

          <div>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
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
                  "absolute right-4 top-1/2 -translate-y-1/2 rounded-full p-1 text-text-secondary transition-colors hover:text-text-primary " +
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
              <p className="mt-1 pl-4 text-base text-error">
                {errors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={
              "mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-full bg-brand text-base font-semibold text-on-brand transition-all hover:bg-brand-hover active:scale-[0.98] disabled:opacity-60 " +
              focusRing
            }
          >
            {isLoading ? "Creating account…" : "Create Account"}
          </button>

          <div className="my-2 flex items-center gap-4">
            <span className="h-px flex-1 bg-border" />
            <span className="text-base text-text-secondary">or</span>
            <span className="h-px flex-1 bg-border" />
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            className={
              "flex h-12 w-full items-center justify-center gap-3 rounded-full border bg-surface text-base font-medium text-text-primary transition-colors hover:bg-surface-hover active:scale-[0.98] " +
              focusRing
            }
          >
            <GoogleIcon /> Continue with Google
          </button>
        </form>

        <p className="mt-6 text-center text-base text-text-secondary">
          Already have an account?{" "}
          <Link
            href={loginHref}
            className={
              "font-bold text-text-primary hover:underline rounded " + focusRing
            }
          >
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}
