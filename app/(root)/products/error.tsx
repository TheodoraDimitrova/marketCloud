"use client";

import { ErrorMessage } from "@/components/ui/ErrorMessage";

export default function ProductsError({
  error: _error,
  reset: _reset,
}: {
  error: Error;
  reset: () => void;
}) {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <ErrorMessage
        message="Failed to load products. Please try again."
        retry={handleRetry}
      />
    </div>
  );
}
