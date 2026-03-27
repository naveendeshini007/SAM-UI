import { useState, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
 
import { createUser } from "../services/userService";
import { useLoader } from "../context/LoaderContext";
import type { CreateUserResponse, CreateUserFormProps } from "../types/Interfaces";
 
// ─── Zod schema (same as original) ────────────────────────────────────────────
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
 
// ─── SuccessModal ──────────────────────────────────────────────────────────────
function SuccessModal({
  createdUser,
  onClose,
}: {
  createdUser: CreateUserResponse;
  onClose: () => void;
}) {
  const [copied, setCopied] = useState(false);
 
  const handleCopy = async () => {
    await navigator.clipboard.writeText(createdUser.temp_password ?? "");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
 
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);
 
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        style={{ animation: "popIn 0.22s cubic-bezier(0.34,1.56,0.64,1) both" }}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-500 to-blue-700 px-6 py-5 text-white">
          <div className="flex items-center gap-3">
            {/* Checkmark circle */}
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-xs font-medium text-emerald-100 uppercase tracking-widest">User created</p>
              <h3 className="text-lg font-bold leading-tight">New user is ready!</h3>
            </div>
          </div>
        </div>
 
        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* User details grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2 rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">Username</p>
              <p className="text-sm font-semibold text-gray-900">{createdUser.username}</p>
            </div>
            <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">Full Name</p>
              <p className="text-sm font-semibold text-gray-900">{createdUser.full_name ?? "—"}</p>
            </div>
            <div className="rounded-xl bg-gray-50 border border-gray-100 px-4 py-3">
              <p className="text-xs text-gray-400 font-medium uppercase tracking-wider mb-0.5">Email</p>
              <p className="text-sm font-semibold text-gray-900 truncate">{createdUser.email}</p>
            </div>
          </div>
 
          {/* Temp password */}
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <div className="flex items-center justify-between mb-1.5">
              <p className="text-xs text-amber-700 font-semibold uppercase tracking-wider">
                🔑 Temporary Password
              </p>
              <span className="text-xs text-amber-500 font-medium">shown once only</span>
            </div>
            <div className="flex items-center gap-2 mt-1">
              <code className="flex-1 bg-white border border-amber-200 rounded-lg px-3 py-2 text-sm font-mono text-amber-900 select-all tracking-wide">
                {createdUser.temp_password}
              </code>
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-2 text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white rounded-lg transition-colors whitespace-nowrap"
              >
                {copied ? "✓ Copied" : "Copy"}
              </button>
            </div>
            <p className="text-xs text-amber-600 mt-2">
              Share this with the user. They must change it on first login.
            </p>
          </div>
        </div>
 
        {/* Footer */}
        <div className="px-6 pb-5">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 bg-gray-900 hover:bg-gray-700 text-white text-sm font-semibold rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
 
      <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.88) translateY(16px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
 
// ─── CreateUserModal ───────────────────────────────────────────────────────────
function CreateUserModal({ onClose, onUserCreated }: { onClose: () => void; onUserCreated: () => void }) {
  const { showLoader, hideLoader } = useLoader();
  const [serverError, setServerError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdUser, setCreatedUser] = useState<CreateUserResponse | null>(null);
  const firstInputRef = useRef<HTMLInputElement | null>(null);
 
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserSchema),
  });
 
  // Auto-focus first field
  useEffect(() => {
    firstInputRef.current?.focus();
  }, []);
 
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape" && !createdUser) onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose, createdUser]);
 
  const onSubmit = async (data: CreateUserFormData) => {
    setServerError(null);
    setIsSubmitting(true);
    showLoader("Creating user…");
    try {
      const result = await createUser(data);
      setCreatedUser(result);
      onUserCreated();
    } catch (err: unknown) {
      const axiosErr = err as { response?: { data?: { detail?: string } } };
      setServerError(axiosErr.response?.data?.detail ?? "Failed to create user. Please try again.");
    } finally {
      setIsSubmitting(false);
      hideLoader();
    }
  };
 
  // Once user is created, swap to the success modal
  if (createdUser) {
    return <SuccessModal createdUser={createdUser} onClose={onClose} />;
  }
 
  const { ref: usernameRef, ...usernameRest } = register("username");
 
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: "rgba(0,0,0,0.45)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
        style={{ animation: "slideUp 0.22s cubic-bezier(0.34,1.56,0.64,1) both" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">Create New User</h2>
            <p className="text-xs text-gray-400 mt-0.5">A temporary password will be generated automatically.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
 
        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="px-6 py-5 space-y-4" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Username */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Username
              </label>
              <input
                type="text"
                autoComplete="off"
                ref={(el) => {
                  usernameRef(el);
                  (firstInputRef as React.MutableRefObject<HTMLInputElement | null>).current = el;
                }}
                {...usernameRest}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                placeholder="john_doe"
              />
              {errors.username && (
                <p className="mt-1 text-xs text-red-500">{errors.username.message}</p>
              )}
            </div>
 
            {/* Email */}
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
                Email
              </label>
              <input
                type="email"
                autoComplete="off"
                {...register("email")}
                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
                placeholder="john@example.com"
              />
              {errors.email && (
                <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>
              )}
            </div>
          </div>
 
          {/* Full Name */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wide">
              Full Name
            </label>
            <input
              type="text"
              autoComplete="off"
              {...register("full_name")}
              className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-800 placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-shadow"
              placeholder="John Doe"
            />
            {errors.full_name && (
              <p className="mt-1 text-xs text-red-500">{errors.full_name.message}</p>
            )}
          </div>
 
          {/* Server error */}
          {serverError && (
            <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-2.5">
              <p className="text-sm text-red-600">{serverError}</p>
            </div>
          )}
 
          {/* Actions */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 font-medium hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold rounded-xl transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  Creating…
                </span>
              ) : "Create User"}
            </button>
          </div>
        </form>
      </div>
 
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: scale(0.92) translateY(20px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
 
// ─── NewUserButton (exported component) ───────────────────────────────────────
export default function NewUserButton({ onUserCreated }: CreateUserFormProps) {
  const [isOpen, setIsOpen] = useState(false);
 
  const handleUserCreated = () => {
    onUserCreated?.();
    // Modal stays open to show success — SuccessModal's "Done" closes it
  };
 
  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 text-sm px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold shadow-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
        </svg>
        New User
      </button>
 
      {isOpen && (
        <CreateUserModal
          onClose={() => setIsOpen(false)}
          onUserCreated={handleUserCreated}
        />
      )}
    </>
  );
}