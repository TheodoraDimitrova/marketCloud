"use client";
import Footer from "@/components/shared/footer/Footer";
import Announcement from "@/components/shared/header/Announcement";
import Header from "@/components/shared/header/Header";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Announcement />
      <Header />
      <div className="flex flex-col">
        <main className="flex-1">{children}</main>
      </div>
      <Footer />
    </>
  );
}
