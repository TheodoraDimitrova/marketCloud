"use client";

import { useState } from "react";
import { X, ChevronLeft } from "lucide-react";
import Link from "next/link";

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu: React.FC<MobileMenuProps> = ({ isOpen, onClose }) => {
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const openDropdown = (label: string) => {
    setActiveDropdown(label);
  };

  const closeDropdown = () => {
    setActiveDropdown(null);
  };

  return (
    <div
      className={`fixed top-0 left-0 h-screen w-3/4 max-w-sm bg-white shadow-lg transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out lg:hidden`}
    >
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b">
        {activeDropdown ? (
          <button
            onClick={closeDropdown}
            className="flex items-center space-x-2"
          >
            <ChevronLeft size={24} />
            <span className="text-lg font-semibold">Back</span>
          </button>
        ) : (
          <button onClick={onClose}>
            <X size={24} />
          </button>
        )}
      </div>

      {/* Menu Content */}
      <div className="flex flex-col p-4 space-y-4">
        {!activeDropdown ? (
          <>
            <button
              onClick={() => openDropdown("SHOP")}
              className="text-lg text-left"
            >
              SHOP
            </button>
            <button
              onClick={() => openDropdown("BRANDS")}
              className="text-lg text-left"
            >
              BRANDS
            </button>
            <Link href="/pages/our-world" className="text-lg" onClick={onClose}>
              OUR WORLD
            </Link>
            <Link href="/demos" className="text-lg" onClick={onClose}>
              DEMOS
            </Link>
          </>
        ) : (
          <div className="space-y-3">
            {activeDropdown === "SHOP" && (
              <>
                <Link
                  href="/collections/all"
                  onClick={onClose}
                  className="block"
                >
                  All Collections
                </Link>
                <Link
                  href="/collections/category1"
                  onClick={onClose}
                  className="block"
                >
                  Technics & Styles
                </Link>
                <Link
                  href="/collections/category2"
                  onClick={onClose}
                  className="block"
                >
                  Our Blog
                </Link>
              </>
            )}
            {activeDropdown === "BRANDS" && (
              <>
                <Link href="/brands/nike" onClick={onClose} className="block">
                  La Mer
                </Link>
                <Link href="/brands/adidas" onClick={onClose} className="block">
                  Dermalogica
                </Link>
                <Link
                  href="/brands/EstéeLauder"
                  onClick={onClose}
                  className="block"
                >
                  Sisley
                </Link>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileMenu;
