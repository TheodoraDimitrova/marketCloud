import { useEffect, useState } from "react";

export const useScrollPosition = (threshold: number = 10) => {
  const [isScrolledDown, setIsScrolledDown] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolledDown((prev) => {
        const scrolled = window.scrollY > threshold;

        if (scrolled && !prev) {
          return true;
        } else if (window.scrollY === 0 && prev) {
          return false;
        }
        return prev;
      });
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [threshold]);

  return isScrolledDown;
};
