"use client";
import Link from "next/link";

interface HeaderLinksProps {
  links: { href: string; label: string }[];
  setActiveIndex: (index: number | null) => void;
}

const HeaderLinks = ({ links, setActiveIndex }: HeaderLinksProps) => {
  return (
    <nav className="hidden md:flex md:items-center space-x-6 h-10 z-10 ">
      {links.map((link, index) => (
        <div
          key={index}
          onMouseEnter={() => {
            setActiveIndex(index);
          }}
        >
          <Link href={link.href} className="first:pl-0" aria-haspopup="true">
            {link.label}
          </Link>
        </div>
      ))}
    </nav>
  );
};

export default HeaderLinks;
