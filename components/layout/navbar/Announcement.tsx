"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { X } from "lucide-react";
import SocialIcons from "@/components/shared/icons/SocialIcons";

const Announcement = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDismissedMobile, setIsDismissedMobile] = useState(false);
  const [isDismissedDesktop, setIsDismissedDesktop] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mobileContainerRef = useRef<HTMLDivElement>(null);
  const isInitialMount = useRef(true);

  const handleDismissMobile = () => {
    setIsDismissedMobile(true);
  };

  const handleDismissDesktop = () => {
    setIsDismissedDesktop(true);
  };

  const announcements = [
    {
      text: "New arrivals. ",
      linkText: "Shop now! ",
      linkHref: "/products?discounts=New+Arrival",
    },
    {
      text: "Free shipping on orders over 60 Euro. ",
      linkText: "Check out our offers! ",
      linkHref: "/deals",
    },
    {
      text: "Get 20% off your first purchase. ",
      linkText: "Join our newsletter. ",
      linkHref: "#footer",
    },
  ];
  const currentAnnouncement = announcements[currentIndex];

  useEffect(() => {
    // Mark that initial mount is complete after first render
    if (isInitialMount.current) {
      isInitialMount.current = false;
    }

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4000);

    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  // Use useLayoutEffect to update height synchronously before paint
  useLayoutEffect(() => {
    const updateHeight = () => {
      // Get the visible element (desktop or mobile)
      // Desktop is visible on md+ screens, mobile on smaller screens
      const desktopElement = containerRef.current;
      const mobileElement = mobileContainerRef.current;
      
      // Check window width to determine which element should be measured
      const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
      
      const element = isMobile ? mobileElement : desktopElement;
      
      if (element && element.offsetParent !== null) {
        // Element is visible (offsetParent is not null for visible elements)
        const height = element.clientHeight;
        document.documentElement.style.setProperty(
          "--announcement-height",
          `${height}px`
        );
      } else if (desktopElement) {
        // Fallback to desktop element
        const height = desktopElement.clientHeight;
        document.documentElement.style.setProperty(
          "--announcement-height",
          `${height}px`
        );
      } else if (mobileElement) {
        // Fallback to mobile element
        const height = mobileElement.clientHeight;
        document.documentElement.style.setProperty(
          "--announcement-height",
          `${height}px`
        );
      }
    };

    // Update height immediately
    updateHeight();

    // Use ResizeObserver for better performance than resize event
    const resizeObserver = new ResizeObserver(() => {
      updateHeight();
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    if (mobileContainerRef.current) {
      resizeObserver.observe(mobileContainerRef.current);
    }

    // Also listen to window resize to handle breakpoint changes
    const handleResize = () => {
      updateHeight();
    };
    window.addEventListener('resize', handleResize);

    return () => {
      resizeObserver.disconnect();
      window.removeEventListener('resize', handleResize);
    };
  }, [currentIndex, isDismissedMobile, isDismissedDesktop]);

  return (
    <>
      {/* Desktop/Tablet Version - Original */}
      {!isDismissedDesktop && (
        <div
          ref={containerRef}
          className="announcement-bar hidden md:block sticky top-0 z-30 py-2.5 px-4 text-center text-sm font-medium tracking-wide"
        >
          <div className="flex items-center justify-center px-4 md:px-6 lg:px-10 relative">
            <div className="absolute left-4 md:left-6 lg:left-10 py-1 flex items-center">
              <SocialIcons size="sm" />
            </div>

            <div className="text-center mx-auto max-w-full px-8 md:px-12 lg:px-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentIndex}
                  initial={isInitialMount.current ? false : { opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -50 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="announcement__text flex flex-col md:flex-row items-center justify-center gap-2 md:gap-2 lg:gap-3">
                    <p className="text-sm font-medium tracking-wide whitespace-nowrap mb-0 text-inherit">
                      {currentAnnouncement.text}
                    </p>
                    {currentAnnouncement.linkHref === "#footer" ? (
                      <button
                        onClick={() => {
                          const footer = document.getElementById("footer");
                          if (footer) {
                            footer.scrollIntoView({
                              behavior: "smooth",
                              block: "start",
                            });
                          }
                        }}
                        className="font-bold underline hover:no-underline transition-all cursor-pointer text-sm whitespace-nowrap text-inherit"
                      >
                        {currentAnnouncement.linkText}
                      </button>
                    ) : (
                      <Link
                        href={currentAnnouncement.linkHref}
                        className="font-bold text-inherit underline hover:no-underline transition-all text-sm whitespace-nowrap"
                      >
                        {currentAnnouncement.linkText}
                      </Link>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
            <button
              onClick={handleDismissDesktop}
              className="absolute right-2 md:right-4 lg:right-10 top-1/2 -translate-y-1/2 p-1.5 hover:opacity-80 rounded transition-opacity flex-shrink-0 z-20 text-inherit"
              aria-label="Dismiss announcement"
              type="button"
            >
              <X className="w-4 h-4 md:w-5 md:h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Version - Single line with text as link and dismiss */}
      {!isDismissedMobile && (
        <div
          ref={mobileContainerRef}
          className="announcement-bar md:hidden sticky top-0 z-30 flex items-center justify-center py-2.5 px-4 text-center text-sm font-medium tracking-wide min-h-[44px]"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={isInitialMount.current ? false : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
              className="text-center text-inherit"
            >
              {currentAnnouncement.linkHref === "#footer" ? (
                <button
                  onClick={() => {
                    const footer = document.getElementById("footer");
                    if (footer) {
                      footer.scrollIntoView({
                        behavior: "smooth",
                        block: "start",
                      });
                    }
                  }}
                  className="text-sm font-medium text-inherit hover:underline"
                >
                  {currentAnnouncement.text}
                </button>
              ) : (
                <Link
                  href={currentAnnouncement.linkHref}
                  className="text-sm font-medium text-inherit hover:underline"
                >
                  {currentAnnouncement.text}
                </Link>
              )}
            </motion.div>
          </AnimatePresence>
          <button
            onClick={handleDismissMobile}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:opacity-80 rounded transition-opacity flex-shrink-0 z-20 text-inherit"
            aria-label="Dismiss announcement"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
};

export default Announcement;
