"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { X, Gift, Truck, Sparkles } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";

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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-40 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4"
          onClick={handleClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ 
              type: "spring", 
              stiffness: 300, 
              damping: 30,
              duration: 0.4 
            }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-lg rounded-3xl bg-gradient-to-br from-white to-gray-50 p-8 sm:p-10 shadow-2xl border border-gray-100"
          >
            {/* Decorative elements */}
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-accent to-accent rounded-full opacity-20 blur-2xl"></div>
            <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-navy to-navy-dark rounded-full opacity-10 blur-3xl"></div>

            <button
              type="button"
              aria-label="Close"
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-full p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-all duration-200 hover:scale-110 z-10"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Icon and badge */}
            <div className="flex items-center justify-center mb-6">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ 
                  delay: 0.2, 
                  type: "spring", 
                  stiffness: 200 
                }}
                className="relative"
              >
                <div className="w-20 h-20 bg-gradient-to-br from-accent to-accent rounded-full flex items-center justify-center shadow-lg">
                  <Gift className="h-10 w-10 text-white" />
                </div>
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 5, -5, 0]
                  }}
                  transition={{ 
                    duration: 2, 
                    repeat: Infinity,
                    repeatDelay: 1
                  }}
                  className="absolute -top-2 -right-2"
                >
                  <Sparkles className="h-6 w-6 text-accent" />
                </motion.div>
              </motion.div>
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl mb-3 font-bold text-gray-900 text-center pr-8"
            >
              Wait! Before you go
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-base sm:text-lg text-gray-600 mb-8 leading-relaxed text-center"
            >
              Don&apos;t miss free shipping and -20% on your first order.
            </motion.p>

            {/* Benefits */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 mb-8"
            >
              <div className="flex items-center gap-3 bg-blue-50 rounded-xl p-4 flex-1">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <Truck className="h-5 w-5 text-navy" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">Free Shipping</p>
                  <p className="text-xs text-gray-600">Over €60</p>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-primary/10 rounded-xl p-4 flex-1">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center flex-shrink-0">
                  <Gift className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-semibold text-gray-900 text-sm">-20% Off</p>
                  <p className="text-xs text-gray-600">First Order</p>
                </div>
              </div>
            </motion.div>

            {/* Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="flex flex-col gap-3 sm:flex-row sm:items-stretch"
            >
              <Button 
                asChild 
                variant="accent" 
                className="w-full sm:flex-1 hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-xl"
              >
                <Link href="/deals" onClick={handleClose}>View current offers</Link>
              </Button>
              <Button
                type="button"
                variant="default"
                className="w-full sm:flex-1 hover:scale-105 transition-transform duration-200"
                onClick={handleClose}
              >
                Continue shopping
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ExitIntentPopup;

