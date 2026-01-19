import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaPinterest,
} from "react-icons/fa";
import IconLinkGroup from "./IconLinkGroup";
interface SocialIconsProps {
  size?: "xs" | "sm" | "md" | "lg";
}

const SocialIcons = ({ size = "md" }: SocialIconsProps) => {
  const socialLinks = [
    { href: "https://facebook.com", label: "Facebook", Icon: FaFacebook },
    { href: "https://twitter.com", label: "Twitter", Icon: FaTwitter },
    { href: "https://instagram.com", label: "Instagram", Icon: FaInstagram },
    { href: "https://pinterest.com", label: "Pinterest", Icon: FaPinterest },
  ];

  return <IconLinkGroup links={socialLinks} size={size} />;
};

export default SocialIcons;
