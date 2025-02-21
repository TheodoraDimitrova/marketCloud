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
    <div className="flex space-x-4">
      {links.map(({ href, label, Icon, extraClasses }) => (
        <Link key={label} href={href} aria-label={label}>
          <Icon
            className={` hover:text-red-600 transition-colors ${extraClasses}`}
          />
        </Link>
      ))}
    </div>
  );
};

export default IconLinkGroup;
