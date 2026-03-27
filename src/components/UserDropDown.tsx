import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import ChangePasswordForm from "./ChangePasswordForm";
 
export default function UserDropdown() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
 
  const displayName = user?.full_name || user?.username || "User";
  const email = user?.email || "";
 
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);
 
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setShowChangePassword(false);
      }
    }
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);
 
  return (
    <>
      <div className="relative" ref={dropdownRef}>
 
        {/* Trigger — person icon only */}
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="flex items-center justify-center h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-md shadow-blue-200 ring-2 ring-white hover:scale-105 transition-transform duration-150"
          aria-haspopup="true"
          aria-expanded={open}
        >
          <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
          </svg>
        </button>
 
        {/* Dropdown panel */}
        {open && (
          <div className="absolute right-0 top-0 w-64 bg-white rounded-2xl shadow-xl shadow-gray-200/80 border border-gray-100 z-50 overflow-hidden">
 
            {/* User info header */}
            <div className="px-4 py-4 bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-blue-100/60">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate leading-tight">{displayName}</p>
                  <p className="text-xs text-gray-500 truncate mt-0.5">{email}</p>
                </div>
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white flex items-center justify-center shadow-md shadow-blue-200 ring-2 ring-white shrink-0">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.7 0 4.8-2.1 4.8-4.8S14.7 2.4 12 2.4 7.2 4.5 7.2 7.2 9.3 12 12 12zm0 2.4c-3.2 0-9.6 1.6-9.6 4.8v2.4h19.2v-2.4c0-3.2-6.4-4.8-9.6-4.8z"/>
                  </svg>
                </div>
              </div>
            </div>
 
            {/* Action buttons */}
            <div className="p-2">
              <button
                onClick={() => { setOpen(false); setShowChangePassword(true); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-gray-700 hover:bg-gray-50 hover:text-gray-900 transition-all duration-100 group/item"
              >
                <span className="h-7 w-7 rounded-lg bg-gray-100 group-hover/item:bg-blue-100 flex items-center justify-center transition-colors shrink-0">
                  <svg className="w-3.5 h-3.5 text-gray-500 group-hover/item:text-blue-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                  </svg>
                </span>
                <span className="font-medium">Change Password</span>
              </button>
 
              <div className="my-1.5 border-t border-gray-100" />
 
              <button
                onClick={() => { setOpen(false); logout(); }}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 hover:text-red-700 transition-all duration-100 group/item"
              >
                <span className="h-7 w-7 rounded-lg bg-red-50 group-hover/item:bg-red-100 flex items-center justify-center transition-colors shrink-0">
                  <svg className="w-3.5 h-3.5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                  </svg>
                </span>
                <span className="font-medium">Log Out</span>
              </button>
            </div>
          </div>
        )}
      </div>
 
      {/* Change Password Modal */}
      {showChangePassword && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 backdrop-blur-sm"
            style={{ backgroundColor: "rgba(15, 23, 42, 0.80)" }}
            onClick={() => setShowChangePassword(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden z-10">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-base font-bold text-gray-900">Change Password</h2>
                <p className="text-xs text-gray-400 mt-0.5">Enter your current password and choose a new one.</p>
              </div>
              <button
                onClick={() => setShowChangePassword(false)}
                className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {/* Form */}
            <div className="px-6 py-5">
              <ChangePasswordForm
                mode="authenticated"
                onSuccess={() => setShowChangePassword(false)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
 