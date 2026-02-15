"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  LogOut,
  ShoppingCart,
  Package,
  Users,
  Mail,
  BarChart3,
  MessageSquare,
  Settings,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/admin/ui/sidebar";

const nav = [
  { label: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { label: "Orders", href: "/admin/orders", icon: ShoppingCart },
  { label: "Products", href: "/admin/products", icon: Package },
  { label: "Customers", href: "/admin/customers", icon: Users },
  { label: "Marketing", href: "/admin/marketing", icon: Mail },
  { label: "Messages", href: "/admin/messages", icon: MessageSquare },
  { label: "Reports", href: "/admin/reports", icon: BarChart3 },
  { label: "Settings", href: "/admin/settings", icon: Settings },
];

export function AppSidebar() {
  const pathname = usePathname();

  const handleLogout = () => {
    signOut({ callbackUrl: "/admin/login" });
  };

  return (
    <Sidebar>
      <SidebarHeader className="flex h-14 min-h-14 shrink-0 flex-row items-center gap-2 border-b border-border p-0 px-4">
        <h1 className="m-0 min-w-0 flex-1 truncate text-lg font-semibold leading-none text-sidebar-foreground">
          Admin
        </h1>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Menu</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {nav.map((item) => {
                const isActive =
                  pathname === item.href ||
                  (item.href !== "/admin" && pathname.startsWith(item.href));
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={isActive}>
                      <Link href={item.href}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <div className="mt-auto border-t border-sidebar-border p-2">
          <SidebarMenuButton onClick={handleLogout} className="w-full">
            <LogOut className="h-4 w-4" />
            <span>Log out</span>
          </SidebarMenuButton>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
