"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Footer from "@/components/layout/footer/Footer";
import Announcement from "@/components/layout/navbar/Announcement";
import NavBar from "@/components/layout/navbar/NavBar";
import PageTransition from "@/components/shared/common/PageTransition";
import ExitIntentPopup from "@/components/shared/common/ExitIntentPopup";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { useAppSelector } from "@/hooks/useAppSelector";
import { clearCart } from "@/store/slices/cartSlice";
import { clearOrder } from "@/store/slices/orderSlice";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isCheckout = pathname.startsWith("/checkout");
  const dispatch = useAppDispatch();
  const order = useAppSelector((state) => state.order?.order ?? null);

  // Clear cart and order when we're outside checkout flow but have order in store.

  useEffect(() => {
    const onThankYou =
      typeof pathname === "string" && pathname.includes("/checkout/thank-you");
    const onCheckoutForm = pathname === "/checkout";
    if (!onThankYou && !onCheckoutForm && order != null) {
      dispatch(clearCart());
      dispatch(clearOrder());
    }
  }, [pathname, order, dispatch]);

  return (
    <>
      {!isCheckout && <Announcement />}
      {!isCheckout && <NavBar />}
      {!isCheckout && <ExitIntentPopup />}

      <div className="flex flex-col">
        <main className="flex-1">
          <PageTransition>{children}</PageTransition>
        </main>
        {!isCheckout && <Footer />}{" "}
      </div>
    </>
  );
}
