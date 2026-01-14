import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

const Breadcrumb = ({ items }: BreadcrumbProps) => {
  if (!items || items.length === 0) {
    return null;
  }

  return (
    <nav
      className="flex items-center space-x-2 text-sm text-gray-600 mb-4"
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <React.Fragment key={index}>
            {isLast ? (
              <span className="text-gray-900 font-medium">{item.label}</span>
            ) : (
              <>
                <Link
                  href={item.href || "#"}
                  className="hover:text-gray-900 transition-colors"
                >
                  {item.label}
                </Link>
                <ChevronRight className="h-4 w-4 text-gray-400" />
              </>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
};

export default Breadcrumb;
