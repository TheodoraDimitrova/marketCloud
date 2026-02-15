import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";

const ADMIN_ACCESS_QUERY = "*[_type == \"adminAccess\"][0].emails";

/** Fetch allowed admin emails from Sanity (Edge-safe) */
async function getAllowedAdminEmails(): Promise<string[]> {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-12-11";
  const token = process.env.SANITY_API_TOKEN;

  if (!projectId || !dataset) return [];

  const url = `https://${projectId}.api.sanity.io/v${apiVersion}/data/query/${dataset}?query=${encodeURIComponent(ADMIN_ACCESS_QUERY)}`;
  const headers: HeadersInit = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const res = await fetch(url, { headers, next: { revalidate: 60 } });
    if (!res.ok) return [];
    const json = await res.json();
    const emails = json?.result;
    return Array.isArray(emails) ? emails.filter((e: unknown) => typeof e === "string" && e.includes("@")) : [];
  } catch {
    return [];
  }
}

function isAdminLogin(pathname: string): boolean {
  return pathname === "/admin/login" || pathname.startsWith("/admin/login/");
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isAdminArea = pathname.startsWith("/admin");
  const isAdminApi = pathname.startsWith("/api/admin");
  if (!isAdminArea && !isAdminApi) {
    return NextResponse.next();
  }

  // NextAuth routes – do not protect
  if (pathname.startsWith("/api/auth/")) {
    return NextResponse.next();
  }

  const session = await auth();
  const email = session?.user?.email ?? null;

  // Admin API (orders, etc.): require allowed session
  if (isAdminApi) {
    const allowed = await getAllowedAdminEmails();
    const isAllowed = email && allowed.length > 0 && allowed.includes(email);
    if (!isAllowed) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.next();
  }

  // Admin UI login page
  if (isAdminLogin(pathname)) {
    const allowed = await getAllowedAdminEmails();
    const isAllowed = email && allowed.length > 0 && allowed.includes(email);
    if (isAllowed) {
      const url = request.nextUrl.clone();
      url.pathname = "/admin";
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  // All other /admin/* – require allowed session
  const allowed = await getAllowedAdminEmails();
  const isAllowed = email && allowed.length > 0 && allowed.includes(email);
  if (!isAllowed) {
    const url = request.nextUrl.clone();
    url.pathname = "/admin/login";
    url.searchParams.set("from", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/api/admin", "/api/admin/:path*"],
};
