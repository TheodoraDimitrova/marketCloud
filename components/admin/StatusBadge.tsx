"use client";

import { cn } from "@/lib/utils";

const statusColors: Record<string, string> = {
  New: "bg-blue-100 text-blue-800",
  new: "bg-blue-100 text-blue-800",
  Pending: "bg-amber-100 text-amber-800",
  Paid: "bg-green-100 text-green-800",
  Unpaid: "bg-amber-100 text-amber-800",
  Processing: "bg-sky-100 text-sky-800",
  Shipped: "bg-purple-100 text-purple-800",
  "In transit": "bg-indigo-100 text-indigo-800",
  Delivered: "bg-green-100 text-green-800",
  Returned: "bg-red-100 text-red-800",
  Refunded: "bg-gray-100 text-gray-800",
  Cancelled: "bg-red-100 text-red-800",
  Active: "bg-green-100 text-green-800",
  Draft: "bg-gray-100 text-gray-600",
  Replied: "bg-green-100 text-green-800",
  replied: "bg-green-100 text-green-800",
  read: "bg-gray-100 text-gray-800",
  closed: "bg-gray-100 text-gray-600",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  const color = statusColors[status] ?? "bg-gray-100 text-gray-800";
  const displayStatus = status.charAt(0).toUpperCase() + status.slice(1);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
        color,
        className
      )}
    >
      {displayStatus}
    </span>
  );
}
