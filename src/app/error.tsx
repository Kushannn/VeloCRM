"use client";

import { useEffect } from "react";
import { Button } from "@heroui/react";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Global Error:", error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen gap-4 p-6 text-center">
      <div className="flex justify-center">
        <AlertTriangle className="w-16 h-16 text-red-500" />
      </div>

      <h1 className="text-3xl font-bold">Something went wrong</h1>

      <p className="text-gray-400 text-sm">
        An unexpected error occurred. You can try again or refresh the page.
      </p>

      {/* Optional: show error in dev */}
      {process.env.NODE_ENV === "development" && (
        <pre className="bg-black/40 p-3 rounded-md text-xs text-left overflow-auto">
          {error.message}
        </pre>
      )}

      <div className="flex justify-center gap-4">
        <Button
          variant="danger"
          // variant=""
          onClick={() => reset()}
          className="flex items-center gap-2"
        >
          <RefreshCcw size={16} />
          Try Again
        </Button>

        <Button variant="outline" onClick={() => window.location.reload()}>
          Refresh Page
        </Button>
      </div>
    </div>
  );
}
