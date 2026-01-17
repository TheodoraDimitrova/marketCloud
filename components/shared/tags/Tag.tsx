import React from "react";

interface TagProps {
  type: "discount" | "new" | "limited" | "default";
  label: string;
}

const Tag = ({ type, label }: TagProps) => {
  // Luxury color palette: бордо/dusty rose вместо ярки цветове
  const tagStyles = {
    discount: "bg-[#7d0d23] text-white",
    new: "bg-[#C9A9A6] text-[#1F2933]",
    limited: "bg-[#D4AF8E] text-[#1F2933]",
    default: "bg-gray-400 text-white",
  };

  return (
    <span
      className={`px-2.5 py-1 text-xs font-medium rounded ${
        tagStyles[type] || tagStyles.default
      }`}
    >
      {label}
    </span>
  );
};

export default Tag;
