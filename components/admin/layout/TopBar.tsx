"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { ChevronRight } from "lucide-react";
import { SidebarTrigger } from "@/components/admin/ui/sidebar";

interface Breadcrumb {
  label: string;
  href: string;
}

interface TopBarProps {
  title: string;
  breadcrumbs?: Breadcrumb[];
}

export default function TopBar({ title, breadcrumbs }: TopBarProps) {
  const { data: session } = useSession();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-10 flex h-14 min-h-14 shrink-0 items-center gap-3 border-b border-border bg-background px-4">
      <SidebarTrigger className="shrink-0" aria-label="Toggle sidebar menu" />

      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex min-h-0 flex-shrink-0 items-center gap-1 text-sm text-muted-foreground">
          {breadcrumbs.map((b) => (
            <span key={b.href} className="flex items-center gap-1">
              <Link
                href={b.href}
                className="hover:text-foreground transition-colors"
              >
                {b.label}
              </Link>
              <ChevronRight className="h-4 w-4 shrink-0" />
            </span>
          ))}
        </nav>
      )}

      <h1 className="m-0 min-w-0 flex-1 truncate text-lg font-semibold leading-none text-foreground">
        {title}
      </h1>

      {user && (
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {user.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={user.image}
              alt={user.name || user.email || "Admin avatar"}
              className="h-8 w-8 rounded-full border border-border object-cover"
            />
          )}
          <div className="flex flex-col items-end leading-tight">
            <span className="max-w-[140px] truncate text-foreground text-sm font-medium">
              {user.name || user.email}
            </span>
            {user.email && (
              <span className="max-w-[140px] truncate">
                {user.email}
              </span>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
