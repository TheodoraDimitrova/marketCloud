"use client";
import Footer from "@/components/layout/footer/Footer";
import Announcement from "@/components/layout/navbar/Announcement";
import NavBar from "@/components/layout/navbar/NavBar";
import { usePathname } from "next/navigation";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isCheckout = pathname.startsWith("/checkout");

  return (
    <>
      {!isCheckout && <Announcement />}
      {!isCheckout && <NavBar />}

      <div className="flex flex-col">
        <main className="flex-1">{children}</main>
        {!isCheckout && <Footer />}{" "}
      </div>
    </>
  );
}
