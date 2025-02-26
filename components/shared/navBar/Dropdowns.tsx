import React, { JSX } from "react";

const Dropdowns = ({ dropdown }: { dropdown: JSX.Element | null }) => {
  if (!dropdown) return null;

  return (
    <div className="absolute top-full left-0 w-full bg-white shadow-lg border-t border-t-gray-400">
      {dropdown}
    </div>
  );
};

export default Dropdowns;
