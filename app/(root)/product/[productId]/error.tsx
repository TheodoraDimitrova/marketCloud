"use client";

import { ErrorMessage } from "@/components/ui/ErrorMessage";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function ProductPageError() {
  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md">
        <ErrorMessage
          message="Failed to load product. Please try again."
          retry={handleRetry}
        />
        <div className="mt-4 text-center">
          <Button>
            <Link href="/products">Back to Products</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
