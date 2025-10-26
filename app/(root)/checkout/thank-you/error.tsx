"use client";

import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function Error({
  error,
}: {
  error: Error & { digest?: string };
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-6 shadow-md text-center">
        <h1 className="text-2xl font-bold text-red-600">
          Something went wrong
        </h1>
        <p className="mt-2 text-gray-700">
          {error.message || "An unexpected error occurred."}
        </p>
        <p className="mt-4 text-gray-600">
          If the problem persists, please contact our support team.
        </p>
        <Button>
          <Link href="/"> Go back to homepage</Link>
        </Button>
      </div>
    </div>
  );
}
