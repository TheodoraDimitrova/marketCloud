"use client";
import Footer from "@/components/shared/footer/Footer";
import Announcement from "@/components/shared/navBar/Announcement";
import NavBar from "@/components/shared/navBar/NavBar";
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
