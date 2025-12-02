import { useState } from "react";

interface UseNavbarStateReturn {
  isHovered: boolean;
  isMobileMenuOpen: boolean;
  activeIndex: number | null;
  isCartOpen: boolean;
  setIsHovered: (value: boolean) => void;
  setIsMobileMenuOpen: (value: boolean) => void;
  setActiveIndex: (value: number | null) => void;
  setIsCartOpen: (value: boolean) => void;
  handleMouseEnter: () => void;
  handleMouseLeave: () => void;
}

export const useNavbarState = (): UseNavbarStateReturn => {
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
