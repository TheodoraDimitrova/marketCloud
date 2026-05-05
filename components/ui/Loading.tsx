import Image from "next/image";
import loaderGif from "@/assets/loader.gif";

interface LoadingProps {
  height?: string;
  className?: string;
}

export const Loading = ({ height = "h-64", className = "" }: LoadingProps) => {
  return (
    <div className={`flex-center ${height} ${className}`}>
      <Image
        src={loaderGif}
        alt="Loading"
        className="h-20 w-auto object-contain"
        priority
      />
    </div>
  );
};
