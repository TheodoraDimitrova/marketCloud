"use client";

import { usePathname } from "next/navigation";
import "@/assets/styles/admin.css";
import { SidebarProvider, SidebarInset } from "@/components/admin/ui/sidebar";
import { AppSidebar } from "@/components/admin/layout";

const AdminLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const pathname = usePathname();
  const isLoginPage = pathname === "/admin/login";

  if (isLoginPage) {
    return (
      <div className="admin-panel min-h-screen bg-background">
        {children}
      </div>
    );
  }

  return (
    <div className="admin-panel min-h-screen bg-background">
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset>{children}</SidebarInset>
      </SidebarProvider>
    </div>
  );
};

export default AdminLayout;
