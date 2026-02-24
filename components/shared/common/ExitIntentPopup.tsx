"use client";

import { useEffect, useState } from "react";
import Modal from "@/components/ui/Modal";

const EXIT_INTENT_STORAGE_KEY = "exit_intent_shown";
const MIN_TIME_ON_PAGE = 2000; // 2 seconds minimum before showing popup

const ExitIntentPopup = () => {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Don't show on mobile devices (touch devices)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    ) || window.innerWidth < 768;
    
    if (isMobile) return;

    const hasShown = sessionStorage.getItem(EXIT_INTENT_STORAGE_KEY);
    if (hasShown) return;

    const pageLoadTime = Date.now();
    let hasInteracted = false;

    // Track user interaction
    const handleInteraction = () => {
      hasInteracted = true;
    };

    // Track mouse movement for interaction
    const handleMouseMove = () => {
      if (!hasInteracted) {
        hasInteracted = true;
      }
    };

    // Add interaction listeners
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("click", handleInteraction, { once: true });
    document.addEventListener("scroll", handleInteraction, { once: true });

    const handleMouseOut = (event: MouseEvent) => {
      // Check if user has been on page for minimum time
      const timeOnPage = Date.now() - pageLoadTime;
      if (timeOnPage < MIN_TIME_ON_PAGE) return;

      // Check if user has interacted with the page
      if (!hasInteracted) return;

      // Get the element that the mouse is leaving to
      const relatedTarget = event.relatedTarget as HTMLElement | null;

   
      if (event.clientY <= 0 && (!relatedTarget || relatedTarget.nodeName === "HTML")) {
        sessionStorage.setItem(EXIT_INTENT_STORAGE_KEY, "true");
        setIsOpen(true);
        // Clean up listeners
        document.removeEventListener("mouseout", handleMouseOut);
        document.removeEventListener("mousemove", handleMouseMove);
        document.removeEventListener("click", handleInteraction);
        document.removeEventListener("scroll", handleInteraction);
      }
    };

    // Use mouseout on document for exit intent detection
    document.addEventListener("mouseout", handleMouseOut);

    return () => {
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("click", handleInteraction);
      document.removeEventListener("scroll", handleInteraction);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleViewOffers = () => {
    handleClose();
    window.location.href = "/deals";
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      type="warning"
      title="Wait! Before you go"
      primaryButton={{
        label: "View current offers",
        onClick: handleViewOffers,
        variant: "accent",
      }}
      secondaryButton={{
        label: "Continue shopping",
        onClick: handleClose,
        variant: "outline",
      }}
      className="max-w-lg"
    >
      <p className="text-base sm:text-lg mb-4">
        Don&apos;t miss free shipping and -20% on your first order.
      </p>
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex items-center gap-3 bg-blue-50 rounded-xl p-4 flex-1">
          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="h-5 w-5 text-navy" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">Free Shipping</p>
            <p className="text-xs text-gray-600">Over €60</p>
          </div>
        </div>
        <div className="flex items-center gap-3 bg-primary/10 rounded-xl p-4 flex-1">
          <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
            <svg className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
          </div>
          <div>
            <p className="font-semibold text-gray-900 text-sm">-20% Off</p>
            <p className="text-xs text-gray-600">First Order</p>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ExitIntentPopup;

