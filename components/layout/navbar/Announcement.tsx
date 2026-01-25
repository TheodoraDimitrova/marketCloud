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
  const [iconSize, setIconSize] = useState<"sm" | "md" | "lg">("sm");
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

  useEffect(() => {
    const updateIconSize = () => {
      if (typeof window !== 'undefined') {
        const width = window.innerWidth;
        if (width >= 1024) {
          // Large screens use medium icons
          setIconSize("md");
        } else if (width >= 768) {
          // Tablet uses small icons
          setIconSize("sm");
        } else {
          // Mobile uses small icons
          setIconSize("sm");
        }
      }
    };

    // Update immediately on mount
    updateIconSize();
    
    window.addEventListener('resize', updateIconSize);
    return () => window.removeEventListener('resize', updateIconSize);
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
          className="hidden md:block bg-yellow-500 text-black sticky top-0 z-10"
        >
          <div className="py-4 text-center flex items-center justify-center px-4 md:px-6 lg:px-10 relative">
            <div className="absolute left-4 md:left-6 lg:left-10">
              <SocialIcons size={iconSize} />
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
                    <p className="text-xs md:text-sm lg:text-base text-black font-medium whitespace-nowrap mb-0">{currentAnnouncement.text}</p>
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
                        className="font-bold text-black underline hover:no-underline transition-all cursor-pointer text-xs md:text-sm lg:text-base whitespace-nowrap"
                      >
                        {currentAnnouncement.linkText}
                      </button>
                    ) : (
                      <Link
                        href={currentAnnouncement.linkHref}
                        className="font-bold text-black underline hover:no-underline transition-all text-xs md:text-sm lg:text-base whitespace-nowrap"
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
              className="absolute right-2 md:right-4 lg:right-10 top-1/2 -translate-y-1/2 p-1.5 hover:bg-yellow-600 rounded transition-colors flex-shrink-0 z-20"
              aria-label="Dismiss announcement"
              type="button"
            >
              <X className="w-4 h-4 md:w-5 md:h-5 text-black" />
            </button>
          </div>
        </div>
      )}

      {/* Mobile Version - Single line with text as link and dismiss */}
      {!isDismissedMobile && (
        <div
          ref={mobileContainerRef}
          className="md:hidden bg-yellow-500 text-black sticky top-0 z-10 flex items-center justify-center px-4 min-h-[44px]"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={isInitialMount.current ? false : { opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.5 }}
              className="text-center"
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
                  className="text-xs font-medium text-black hover:underline"
                >
                  {currentAnnouncement.text}
                </button>
              ) : (
                <Link
                  href={currentAnnouncement.linkHref}
                  className="text-xs font-medium text-black hover:underline"
                >
                  {currentAnnouncement.text}
                </Link>
              )}
            </motion.div>
          </AnimatePresence>
          <button
            onClick={handleDismissMobile}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 hover:bg-yellow-600 rounded transition-colors flex-shrink-0 z-20"
            aria-label="Dismiss announcement"
            type="button"
          >
            <X className="w-4 h-4 text-black" />
          </button>
        </div>
      )}
    </>
  );
};

export default Announcement;
