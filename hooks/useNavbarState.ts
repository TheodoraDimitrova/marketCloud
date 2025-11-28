import { useState } from "react";

export const useNavbarState = () => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setActiveIndex(null);
  };

  return {
    isHovered,
    isMobileMenuOpen,
    activeIndex,
    isCartOpen,
    setIsHovered,
    setIsMobileMenuOpen,
    setActiveIndex,
    setIsCartOpen,
    handleMouseEnter,
    handleMouseLeave,
  };
};
