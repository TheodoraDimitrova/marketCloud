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
  size?: "sm" | "md" | "lg" | "xs";
}

const IconLinkGroup = ({ links, size = "md" }: IconLinkGroupProps) => {
  const sizeClasses = {
    xs: {
      container: "w-6 h-6",
      icon: "text-sm",
      gap: "gap-2",
    },
    sm: {
      container: "w-7 h-7",
      icon: "text-base",
      gap: "gap-2.5",
    },
    md: {
      container: "w-10 h-10",
      icon: "text-[22px]",
      gap: "gap-4",
    },
    lg: {
      container: "w-12 h-12",
      icon: "text-2xl",
      gap: "gap-4",
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <div className={`flex ${currentSize.gap}`}>
      {links.map(({ href, label, Icon, extraClasses }) => (
        <Link
          key={label}
          href={href}
          aria-label={label}
          target="_blank"
          rel="noopener noreferrer"
          className="group"
        >
          <div className={`flex items-center justify-center ${currentSize.container} rounded-full bg-white/10 hover:bg-brand transition-all duration-300 group-hover:scale-110`}>
            <Icon
              className={`${currentSize.icon} group-hover:scale-110 transition-transform duration-300 ${extraClasses}`}
              style={{ color: "#FFFFFF" }}
            />
          </div>
        </Link>
      ))}
    </div>
  );
};

export default IconLinkGroup;
