import Link from "next/link";
import { Button } from "@/components/ui/Button";
export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-6">
      <div className="text-center">
        <h1 className="text-6xl font-bold text-[#1f4769]">404</h1>
        <p className="mt-4 text-xl text-gray-700">Page not found</p>
        <p className="mt-2 mb-4 text-gray-500">
          Sorry, we couldn’t find the page you’re looking for.
        </p>
        <Button>
          <Link href="/">Go back home</Link>
        </Button>
      </div>
    </div>
  );
}
