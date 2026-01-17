import Link from "next/link";
import { IconType } from "react-icons";
import { LucideIcon } from "lucide-react";

interface IconLink {
  href: string;
  label: string;
  Icon: LucideIcon | IconType;
  extraClasses?: string;
}

interface IconLinkGroupProps {
  links: IconLink[];
}

const IconLinkGroup = ({ links }: IconLinkGroupProps) => {
  return (
    <div className="flex gap-4">
      {links.map(({ href, label, Icon, extraClasses }) => (
        <Link
          key={label}
          href={href}
          aria-label={label}
          target="_blank"
          rel="noopener noreferrer"
          className="group"
        >
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-[#7d0d23] transition-all duration-300 group-hover:scale-110">
            <Icon
              className={`text-[22px] group-hover:scale-110 transition-transform duration-300 ${extraClasses}`}
              style={{ color: "#FFFFFF" }}
            />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default IconLinkGroup;
