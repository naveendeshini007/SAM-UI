/**
 * LoaderContext — global loading overlay state.
 *
 * Wraps the app once (in App.tsx) and renders <SAMLoader> at the root level.
 * Any component can call showLoader / hideLoader without prop-drilling.
 *
 * Usage:
 *   const { showLoader, hideLoader } = useLoader();
 *
 *   const handleSubmit = async () => {
 *     showLoader("Signing in…");
 *     try { await login(…); }
 *     finally { hideLoader(); }
 *   };
 */

import { createContext, useCallback, useContext, useState } from "react";
import type { ReactNode } from "react";
import SAMLoader from "../components/SAMLoader";

interface LoaderContextValue {
  /** Show the SAM overlay with an optional message. */
  showLoader: (message?: string) => void;
  /** Hide the SAM overlay. */
  hideLoader: () => void;
}

const LoaderContext = createContext<LoaderContextValue | null>(null);

export function LoaderProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<{ open: boolean; message: string }>({
    open: false,
    message: "Loading…",
  });

  const showLoader = useCallback((message = "Loading…") => {
    setState({ open: true, message });
  }, []);

  const hideLoader = useCallback(() => {
    setState((prev) => ({ ...prev, open: false }));
  }, []);

  return (
    <LoaderContext.Provider value={{ showLoader, hideLoader }}>
      {children}
      <SAMLoader isOpen={state.open} message={state.message} />
    </LoaderContext.Provider>
  );
}

export function useLoader(): LoaderContextValue {
  const ctx = useContext(LoaderContext);
  if (!ctx) throw new Error("useLoader must be used inside <LoaderProvider>");
  return ctx;
}
