"use client";

import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message?: string | null;
  retry?: () => void;
}

const ErrorMessage = ({
  message = "Something went wrong.",
  retry,
}: ErrorMessageProps) => {
  return (
    <div className="flex flex-col items-center justify-center text-center p-6  shadow-sm border">
      <AlertCircle className="w-10 h-10 text-red-500 mb-3" />
      <h2 className="text-lg font-semibold text-red-600 mb-2">Oops!</h2>
      <p className="text-gray-700 mb-4">{message}</p>

      {retry && (
        <button
          onClick={retry}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-all"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorMessage;
