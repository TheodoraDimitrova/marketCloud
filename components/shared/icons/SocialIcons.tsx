import {
  FaFacebook,
  FaTwitter,
  FaInstagram,
  FaPinterest,
} from "react-icons/fa";
import IconLinkGroup from "./IconLinkGroup";
const SocialIcons = () => {
  const socialLinks = [
    { href: "https://facebook.com", label: "Facebook", Icon: FaFacebook },
    { href: "https://twitter.com", label: "Twitter", Icon: FaTwitter },
    { href: "https://instagram.com", label: "Instagram", Icon: FaInstagram },
    { href: "https://pinterest.com", label: "Pinterest", Icon: FaPinterest },
  ];

  return <IconLinkGroup links={socialLinks} />;
};

export default SocialIcons;
