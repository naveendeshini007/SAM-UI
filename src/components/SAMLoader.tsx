/**
 * SAMLoader — full-screen overlay loader branded for SAM.
 *
 * Renders as a React portal directly into document.body so it always sits
 * on top of all page content regardless of stacking context.
 *
 * Usage (via LoaderContext — preferred):
 *   const { showLoader, hideLoader } = useLoader();
 *   showLoader("Signing in…");
 *   // ... await api call
 *   hideLoader();
 *
 * Props (for standalone use):
 *   isOpen   — whether the overlay is visible
 *   message  — optional text shown below the animation (default: "Loading…")
 */

import { createPortal } from "react-dom";

interface SAMLoaderProps {
  isOpen: boolean;
  message?: string;
}

export default function SAMLoader({ isOpen, message = "Loading…" }: SAMLoaderProps) {
  if (!isOpen) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      aria-live="polite"
      aria-label={message}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm" />

      {/* Card */}
      <div className="relative flex flex-col items-center gap-6 px-10 py-10 bg-white rounded-2xl shadow-2xl border border-gray-100 min-w-[220px]">

        {/* ── Animated rings ── */}
        <div className="relative flex items-center justify-center h-20 w-20">
          {/* Outer ring — slow */}
          <span className="absolute inset-0 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin" style={{ animationDuration: "1.4s" }} />
          {/* Middle ring — medium */}
          <span className="absolute inset-3 rounded-full border-4 border-blue-50 border-b-blue-400 animate-spin" style={{ animationDuration: "1s", animationDirection: "reverse" }} />
          {/* Inner ring — fast */}
          <span className="absolute inset-6 rounded-full border-4 border-blue-100 border-t-blue-600 animate-spin" style={{ animationDuration: "0.6s" }} />

          {/* SAM initials in the centre */}
          <span className="relative text-xs font-bold text-blue-600 tracking-widest select-none">
            SAM
          </span>
        </div>

        {/* ── Message ── */}
        <div className="flex flex-col items-center gap-1">
          <p className="text-sm font-medium text-gray-700">{message}</p>
          <p className="text-xs text-gray-400">Security &amp; Access Management</p>
        </div>

        {/* ── Pulsing dot row ── */}
        <div className="flex items-center gap-1.5">
          {[0, 1, 2, 3].map((i) => (
            <span
              key={i}
              className="h-1.5 w-1.5 rounded-full bg-blue-500 animate-bounce"
              style={{ animationDelay: `${i * 0.15}s`, animationDuration: "0.8s" }}
            />
          ))}
        </div>
      </div>
    </div>,
    document.body
  );
}
