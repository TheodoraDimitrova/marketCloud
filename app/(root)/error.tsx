"use client";

import { ErrorMessage } from "@/components/ui/ErrorMessage";

export default function RootError({
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
    <div className="flex-center min-h-screen">
      <ErrorMessage
        message="Failed to load page. Please try again."
        retry={handleRetry}
      />
    </div>
  );
}
