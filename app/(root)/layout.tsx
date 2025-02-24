"use client";
import Footer from "@/components/shared/footer/Footer";
import Announcement from "@/components/shared/header/Announcement";
import NavBar from "@/components/shared/header/NavBar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Announcement />
      <NavBar />
      <div className="flex flex-col">
        <main className="flex-1">{children}</main>
      </div>
      <Footer />
    </>
  );
}
