"use client";

import { ShoppingBag, Search, AlignJustify, Heart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import HeaderLinks from "./HeaderLinks";
import MobileMenu from "./MobileMenu";
import CartDrawer from "@/components/features/cart/CartDrawer";
import ShopDropdown from "./dropdowns/ShopDropdown";
import BrandsDropdown from "./dropdowns/BrandsDropdown";
import OurWorldDropdown from "./dropdowns/OurWorldDropdown";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useNavbarState } from "@/hooks/useNavbarState";
import { useWishlist } from "@/hooks/useWishlist";

const NavBar = () => {
  const {
    isHovered,
    isMobileMenuOpen,
    activeIndex,
    isCartOpen,
    setIsMobileMenuOpen,
    setActiveIndex,
    setIsCartOpen,
    handleMouseEnter,
    handleMouseLeave,
  } = useNavbarState();

  const cartItems = useAppSelector((state) => state.cart.items);
  const { wishlistItems } = useWishlist();
  const [isMounted, setIsMounted] = useState(false);
  const [isScrolledDown, setIsScrolledDown] = useState(false);

  useEffect(() => {
    setIsMounted(true);

    // Initialize scroll position after mount to prevent hydration mismatch
    setIsScrolledDown(window.scrollY > 10);

    const handleScroll = () => {
      setIsScrolledDown(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const router = useRouter();
  const pathname = usePathname();
  const isHomePage = pathname === "/";

  const navigationItems = [
    {
      href: "/categories",
      label: "SHOP",
      Dropdown: ShopDropdown,
    },
    {
      href: "#",
      label: "BRANDS",
      Dropdown: BrandsDropdown,
    },
    {
      href: "/about-us",
      label: "OUR WORLD",
      Dropdown: OurWorldDropdown,
    },
  ];

  return (
    <div
      className={`${
        isHomePage && (isScrolledDown || isHovered)
          ? "bg-white text-black"
          : isHomePage
            ? "bg-transparent text-white"
            : "bg-white text-black border-b border-gray-300"
      } ${isHomePage ? "fixed" : "sticky"} left-0 right-0 w-full z-20 transition-colors duration-700`}
      style={
        isHomePage
          ? {
              top: isScrolledDown ? "0" : "var(--announcement-height, 0px)",
            }
          : {
              top: "0",
            }
      }
      suppressHydrationWarning
      onMouseEnter={() => isHomePage && handleMouseEnter()}
      onMouseLeave={handleMouseLeave}
    >
      <div className="relative mx-auto flex-between lg:flex-row md:flex-col-reverse md:gap-2 px-4 py-2">
        {/* Left Section */}

        <div className="flex items-center ">
          <div className="flex md:hidden items-center space-x-1 md:space-x-4">
            <AlignJustify onClick={() => setIsMobileMenuOpen(true)} />
            <Search onClick={() => router.push("/products")} />
          </div>

          <div>
            <HeaderLinks
              navItems={navigationItems}
              setActiveIndex={setActiveIndex}
            />
          </div>
        </div>

        {/* Middle Section (Logo) */}

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 md:top-6 lg:top-1/2">
          <div className="font-bold uppercase text-center align-middle">
            <Link href="/">Adora Cosmetics</Link>
          </div>
        </div>

        {/* Right Section */}

        <div className="z-2 flex items-center space-x-1 md:space-x-4 md:w-full md:justify-end lg:w-auto">
          <Search
            onClick={() => router.push("/products")}
            className="hidden md:inline-flex cursor-pointer"
          />

          <button
            onClick={() => router.push("/wishlist")}
            className="relative"
            aria-label="Wishlist"
          >
            <Heart size={24} />
            {isMounted && wishlistItems.length > 0 && (
              <span className="absolute -top-3 -right-2 bg-[#7d0d23] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {wishlistItems.length}
              </span>
            )}
          </button>

          <button onClick={() => setIsCartOpen(true)} className="relative">
            <ShoppingBag size={24} />
            {isMounted && cartItems.length > 0 && (
              <span className="absolute -top-3 -right-2 bg-[#7d0d23] text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cartItems.length}
              </span>
            )}
          </button>
        </div>
      </div>
      {activeIndex !== null &&
        (() => {
          const DropdownComponent = navigationItems[activeIndex].Dropdown;
          return (
            <div
              className="absolute top-full left-0 w-full bg-white shadow-xl border-t border-gray-300 z-70 transition-all duration-300 ease-in-out"
              onMouseEnter={() => setActiveIndex(activeIndex)}
              onMouseLeave={() => setActiveIndex(null)}
              onClick={() => setActiveIndex(null)}
            >
              <DropdownComponent />
            </div>
          );
        })()}

      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navigationItems={navigationItems}
      />

      {/* Cart Drawer */}
      <CartDrawer isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </div>
  );
};

export default NavBar;
