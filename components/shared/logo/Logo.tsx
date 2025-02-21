import Image from "next/image";
import Link from "next/link";

const Logo = ({ width = 150, height = 20, className = "" }) => {
  return (
    <Link href="/" className={`block ${className}`}>
      <Image
        src="/images/logo1.png"
        alt="Logo"
        width={width}
        height={height}
        className="object-contain"
        style={{ width: "auto", height: "auto" }}
      />
    </Link>
  );
};

export default Logo;
