"use client";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import SocialIcons from "@/components/shared/icons/SocialIcons";

const Announcement = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

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
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 3000);

    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    const updateHeight = () => {
      if (containerRef.current) {
        const height = containerRef.current.clientHeight;
        document.documentElement.style.setProperty(
          "--announcement-height",
          `${height}px`
        );
      }
    };

    updateHeight();
    window.addEventListener("resize", updateHeight);

    return () => {
      window.removeEventListener("resize", updateHeight);
    };
  }, [currentIndex]);

  return (
    <div
      ref={containerRef}
      className="bg-yellow-500 text-black py-2 text-center flex-between p-10 relative z-10"
    >
      <div className="hidden lg:block">
        <SocialIcons />
      </div>

      <div className="flex-1 text-center">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
          >
            <div className="announcement__text flex flex-col md:flex-row items-center justify-center">
              <p>{currentAnnouncement.text} </p>
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
                  className="font-bold text-black underline cursor-pointer"
                >
                  {currentAnnouncement.linkText}
                </button>
              ) : (
                <Link
                  href={currentAnnouncement.linkHref}
                  className="font-bold text-black underline"
                >
                  {currentAnnouncement.linkText}
                </Link>
              )}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Announcement;
