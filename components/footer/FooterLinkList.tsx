import React from "react";
import Link from "next/link";

interface LinkItem {
  href: string;
  text: string;
}

interface FooterLinkListProps {
  title: string;
  links: LinkItem[];
}
const FooterLinkList: React.FC<FooterLinkListProps> = ({ title, links }) => {
  return (
    <div className="px-5 lg:mr-20 sm:mr-0 sm:w-1/2 pb-5 lg:w-auto lg:pb-0 ">
      <h3 className="text-white h3-bold">{title}</h3>
      <ul>
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-gray-400 hover:text-white hover:underline"
            >
              {link.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FooterLinkList;
