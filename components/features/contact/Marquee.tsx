"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { FaFacebook, FaInstagram } from "react-icons/fa";

const Marquee = () => {
  return (
    <div className="overflow-hidden whitespace-nowrap py-6">
      <motion.div
        className="flex md:space-x-12 min-w-max"
        animate={{ x: ["0", "-100%"] }}
        transition={{
          repeat: Infinity,
          repeatType: "loop",
          duration: 90,
          ease: "linear",
        }}
      >
        {[...Array(7)].map((_, i) => (
          <div key={i} className="flex w-full space-x-2 md:space-x-12">
            <div className="flex w-full space-x-4 md:w-1/2  md:space-x-12">
              <span className="text-xl text-accent ">
                <Link
                  href="https://www.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Facebook @AdoraCosmetics
                </Link>
              </span>
              <div>
                <FaFacebook className="w-8 h-8 text-accent" />
              </div>
            </div>

            <div className="flex w-full space-x-4 md:w-1/2  md:space-x-12">
              <span className="text-xl text-accent">
                <Link
                  href="https://www.instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram @AdoraCosmetics
                </Link>
              </span>
              <span>
                <FaInstagram className="w-8 h-8 text-accent" />
              </span>
            </div>
          </div>
        ))}
      </motion.div>
    </div>
  );
};

export default Marquee;
