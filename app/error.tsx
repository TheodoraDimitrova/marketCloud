"use client";

import { ErrorMessage } from "../components/ui/ErrorMessage";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  console.error("Global error:", error);

  return (
    <div className="flex-center min-h-screen">
      <ErrorMessage
        message="Something went wrong. Please try again."
        retry={reset}
      />
    </div>
  );
}
