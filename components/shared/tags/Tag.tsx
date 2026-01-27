import React from "react";

interface TagProps {
  type: "discount" | "new" | "limited" | "default";
  label: string;
}

const Tag = ({ type, label }: TagProps) => {
  // Luxury color palette: бордо/dusty rose вместо ярки цветове
  const tagStyles = {
    discount: "bg-brand text-white",
    new: "bg-tag-new text-tag-text",
    limited: "bg-tag-limited text-tag-text",
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
