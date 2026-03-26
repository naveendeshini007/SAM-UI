/**
 * ChangePasswordForm component.
 *
 * Two usage modes (controlled by the `mode` prop):
 *
 * 1. "first-login" — user must change their temporary password before getting a token.
 *    - usernameOrEmail is passed as a prop (captured at login, never shown to user)
 *    - old_password field is labelled "Temporary Password"
 *    - Calls changePassword({ username_or_email, old_password, new_password }) — unauthenticated
 *    - On success: redirects to /login so user can log in with their new password
 *
 * 2. "authenticated" — already logged-in user wants to change password.
 *    - old_password field is labelled "Current Password"
 *    - Calls changePassword({ old_password, new_password }) — Bearer token auto-attached
 *    - On success: callback prop `onSuccess` is called (parent decides what to do)
 *
 * FUTURE COGNITO MIGRATION:
 * - Replace changePassword() call with Amplify.Auth.changePassword(user, oldPwd, newPwd)
 * - For first-login, use Amplify's NEW_PASSWORD_REQUIRED challenge flow
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { changePassword } from "../services/authService";
import { useLoader } from "../context/LoaderContext";
import type { ChangePasswordFormProps } from "../types/Interfaces";


const changePasswordSchema = z
  .object({
    oldPassword: z.string().min(1, "This field is required"),
    newPassword: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Must contain at least one uppercase letter")
      .regex(/[0-9]/, "Must contain at least one number"),
    confirmNewPassword: z.string().min(1, "Please confirm your new password"),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords do not match",
    path: ["confirmNewPassword"],
  });

type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;


export default function ChangePasswordForm({
  mode,
  usernameOrEmail,
  onFirstLoginSuccess,
  onSuccess,
}: ChangePasswordFormProps) {
  const { showLoader, hideLoader } = useLoader();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const onSubmit = async (data: ChangePasswordFormData) => {
    setServerError(null);
    setIsSubmitting(true);
    showLoader(mode === "first-login" ? "Setting new password…" : "Changing password…");

    try {
      if (mode === "first-login") {
        await changePassword({
          username_or_email: usernameOrEmail,
          old_password: data.oldPassword,
          new_password: data.newPassword,
        });
        if (onFirstLoginSuccess) {
          onFirstLoginSuccess(data.newPassword);
        }
      } else {
        await changePassword({
          old_password: data.oldPassword,
          new_password: data.newPassword,
        });
        onSuccess?.();
      }
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { detail?: string } };
      };
      setServerError(
        axiosErr.response?.data?.detail ?? "Failed to change password. Please try again."
      );
    } finally {
      setIsSubmitting(false);
      hideLoader();
    }
  };

  const oldPasswordLabel =
    mode === "first-login" ? "Temporary Password" : "Current Password";

  return (
    <div className="w-full max-w-md mx-auto">
      <h2 className="text-xl font-semibold text-gray-800 mb-1">
        {mode === "first-login" ? "Set Your New Password" : "Change Password"}
      </h2>
      {mode === "first-login" && (
        <p className="text-sm text-gray-500 mb-5">
          You must set a new password before continuing.
        </p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        {/* Old / Temporary Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            {oldPasswordLabel}
          </label>
          <input
            type="password"
            autoComplete="current-password"
            {...register("oldPassword")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder={oldPasswordLabel}
          />
          {errors.oldPassword && (
            <p className="mt-1 text-xs text-red-500">{errors.oldPassword.message}</p>
          )}
        </div>

        {/* New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <input
            type="password"
            autoComplete="new-password"
            {...register("newPassword")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="Min 8 chars, 1 uppercase, 1 number"
          />
          {errors.newPassword && (
            <p className="mt-1 text-xs text-red-500">{errors.newPassword.message}</p>
          )}
        </div>

        {/* Confirm New Password */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Confirm New Password
          </label>
          <input
            type="password"
            autoComplete="new-password"
            {...register("confirmNewPassword")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="Repeat new password"
          />
          {errors.confirmNewPassword && (
            <p className="mt-1 text-xs text-red-500">
              {errors.confirmNewPassword.message}
            </p>
          )}
        </div>

        {/* Server Error */}
        {serverError && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2">
            <p className="text-sm text-red-600">{serverError}</p>
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          {mode === "first-login" ? "Set New Password" : "Change Password"}
        </button>
      </form>
    </div>
  );
}
