"use client";
import Link from "next/link";

interface HeaderLinksProps {
  navItems: { href: string; label: string }[];
  setActiveIndex: (index: number | null) => void;
}

const HeaderLinks = ({ navItems, setActiveIndex }: HeaderLinksProps) => {
  return (
    <nav className="hidden md:flex md:items-center space-x-6 h-10 z-10 ">
      {navItems.map((navItem, index) => (
        <div
          key={index}
          onMouseEnter={() => {
            setActiveIndex(index);
          }}
        >
          <Link href={navItem.href} className="first:pl-0" aria-haspopup="true">
            {navItem.label}
          </Link>
        </div>
      ))}
    </nav>
  );
};

export default HeaderLinks;
