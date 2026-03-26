/**
 * CreateUserForm component (admin only).
 *
 * Presents a form to create a new user with username, email, and full_name.
 * On success, shows the generated temporary password in a highlighted box
 * with a copy button — this is the only time it's visible.
 *
 * FUTURE COGNITO/SES MIGRATION:
 * - Remove the temp_password display block entirely
 * - Instead show: "An email with login instructions has been sent to <email>"
 * - Backend will email temp password via SES; never return it in the response
 */

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import { createUser } from "../services/userService";
import { useLoader } from "../context/LoaderContext";
import type { CreateUserResponse , CreateUserFormProps} from "../types/Interfaces";



const createUserSchema = z.object({
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(60, "Username must be 60 characters or less")
    .regex(/^[a-zA-Z0-9_]+$/, "Only letters, numbers, and underscores"),
  email: z.string().email("Must be a valid email address"),
  full_name: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(120, "Full name must be 120 characters or less"),
});

type CreateUserFormData = z.infer<typeof createUserSchema>;



export default function CreateUserForm({ onUserCreated }: CreateUserFormProps) {
  const { showLoader, hideLoader } = useLoader();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdUser, setCreatedUser] = useState<CreateUserResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
  });

  const onSubmit = async (data: CreateUserFormData) => {
    setServerError(null);
    setIsSubmitting(true);
    setCopied(false);
    showLoader("Creating user…");

    try {
      const result = await createUser(data);
      setCreatedUser(result);
      reset();
      onUserCreated?.();
    } catch (err: unknown) {
      const axiosErr = err as {
        response?: { data?: { detail?: string } };
      };
      setServerError(
        axiosErr.response?.data?.detail ?? "Failed to create user. Please try again."
      );
    } finally {
      setIsSubmitting(false);
      hideLoader();
    }
  };

  const handleCopyPassword = async () => {
    if (createdUser?.temp_password) {
      await navigator.clipboard.writeText(createdUser.temp_password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              autoComplete="off"
              {...register("username")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="john_doe"
            />
            {errors.username && (
              <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              autoComplete="off"
              {...register("email")}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
            )}
          </div>
        </div>

        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            autoComplete="off"
            {...register("full_name")}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
            placeholder="John Doe"
          />
          {errors.full_name && (
            <p className="mt-1 text-xs text-red-500">{errors.full_name.message}</p>
          )}
        </div>

        {/* Server error */}
        {serverError && (
          <div className="rounded-lg bg-red-50 border border-red-200 px-3 py-2">
            <p className="text-sm text-red-600">{serverError}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="py-2 px-5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-medium rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Create User
        </button>
      </form>

      {/* Temp password reveal — shown once after successful creation */}
      {createdUser && (
        <div className="rounded-lg border border-amber-300 bg-amber-50 p-4">
          <p className="text-sm font-semibold text-amber-800 mb-1">
            ✅ User <span className="font-bold">{createdUser.username}</span> created
          </p>
          <p className="text-xs text-amber-700 mb-3">
            Share the temporary password below with the user. It will only be shown once.
            They must change it on first login.
          </p>
          <div className="flex items-center gap-2">
            <code className="flex-1 bg-white border border-amber-200 rounded px-3 py-1.5 text-sm font-mono text-amber-900 select-all">
              {createdUser.temp_password}
            </code>
            <button
              type="button"
              onClick={handleCopyPassword}
              className="px-3 py-1.5 text-xs font-medium bg-amber-200 hover:bg-amber-300 text-amber-900 rounded transition-colors"
            >
              {copied ? "Copied!" : "Copy"}
            </button>
          </div>
          <p className="text-xs text-amber-600 mt-2">
            {/* FUTURE COGNITO MIGRATION: remove this block — temp password will be emailed via SES */}
            Email: {createdUser.email}
          </p>
        </div>
      )}
    </div>
  );
}
