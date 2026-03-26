/**
 * LoginPage
 *
 * Flow:
 * 1. User enters username/email + password → POST /login
 * 2a. If require_password_change === true:
 *     - Slide to ChangePasswordForm (first-login mode)
 *     - usernameOrEmail is passed silently as a prop
 *     - On success, redirect to /login so user can sign in fresh
 * 2b. Normal login → token + user stored in AuthContext → redirect to /
 *
 * Already authenticated users hitting /login are redirected to / immediately.
 *
 * FUTURE COGNITO MIGRATION:
 * - Replace login() call with Amplify.Auth.signIn()
 * - Handle NEW_PASSWORD_REQUIRED challenge from Cognito instead of require_password_change
 * - Remove manual token storage — Amplify manages it
 */

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";

import { useAuth } from "../context/AuthContext";
import { useLoader } from "../context/LoaderContext";
import ChangePasswordForm from "../components/ChangePasswordForm";



const loginSchema = z.object({
  usernameOrEmail: z.string().min(1, "Username or email is required"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;


export default function LoginPage() {
  const { login, accessToken, isLoading } = useAuth();
  const { showLoader, hideLoader } = useLoader();
  const navigate = useNavigate();
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [pendingUsername, setPendingUsername] = useState<string>("");
  const [serverError, setServerError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (!isLoading && accessToken) {
      navigate("/", { replace: true });
    }
  }, [accessToken, isLoading, navigate]);

  if (isLoading) return null;

  const onSubmit = async (data: LoginFormData) => {
    setServerError(null);
    showLoader("Signing in…");

    try {
      const response = await login(data.usernameOrEmail, data.password);

      if (response.require_password_change) {
        setPendingUsername(data.usernameOrEmail);
        setShowChangePassword(true);
      } else {
        navigate("/", { replace: true });
      }
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { detail?: string } };
      };
      const detail = axiosErr.response?.data?.detail ?? "";

      if (detail.toLowerCase().includes("inactive")) {
        setServerError("Your account is inactive. Please contact an administrator.");
      } else {
        setServerError("Invalid username/email or password. Please try again.");
      }
    } finally {
      hideLoader();
    }
  };

  const handleFirstLoginSuccess = () => {
    navigate("/login", { replace: true });
  };

  if (showChangePassword) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
          {/* Logo / App name */}
          <div className="mb-6 text-center">
            <h1 className="text-2xl font-bold text-gray-900">SAM</h1>
            <p className="text-sm text-gray-500 mt-1">Security &amp; Access Management</p>
          </div>

          <ChangePasswordForm
            mode="first-login"
            usernameOrEmail={pendingUsername}
            onFirstLoginSuccess={handleFirstLoginSuccess}
          />

          <button
            type="button"
            onClick={() => setShowChangePassword(false)}
            className="mt-4 w-full text-sm text-gray-500 hover:text-gray-700 underline text-center"
          >
            ← Back to login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-md p-8">
        {/* Logo / App name */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">SAM</h1>
          <p className="text-sm text-gray-500 mt-1">Security &amp; Access Management</p>
        </div>

        <h2 className="text-xl font-semibold text-gray-800 mb-6">Sign in</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
          {/* Username or Email */}
          <div>
            <label
              htmlFor="usernameOrEmail"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Username or Email
            </label>
            <input
              id="usernameOrEmail"
              type="text"
              autoComplete="username"
              {...register("usernameOrEmail")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="username or email@example.com"
            />
            {errors.usernameOrEmail && (
              <p className="mt-1 text-xs text-red-500">
                {errors.usernameOrEmail.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              autoComplete="current-password"
              {...register("password")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="mt-1 text-xs text-red-500">{errors.password.message}</p>
            )}
          </div>

          {/* Server error */}
          {serverError && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2">
              <p className="text-sm text-red-600">{serverError}</p>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}
