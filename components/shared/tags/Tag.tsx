import React from "react";

interface TagProps {
  type: "discount" | "new" | "limited" | "default";
  label: string;
}

const Tag = ({ type, label }: TagProps) => {
  const tagStyles = {
    discount: "bg-red-500",
    new: "bg-green-500",
    limited: "bg-yellow-500",
    default: "bg-gray-500",
  };

  return (
    <span
      className={`px-2 py-1 text-white text-sm rounded ${
        tagStyles[type] || tagStyles.default
      }`}
    >
      {label}
    </span>
  );
};

export default Tag;
