"use client";

import { ErrorMessage } from "@/components/ui/ErrorMessage";

export default function ProductsError() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="flex-center min-h-screen">
      <ErrorMessage
        message="Failed to load products. Please try again."
        retry={handleRetry}
      />
    </div>
  );
}
