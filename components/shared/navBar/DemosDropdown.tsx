import React from "react";
import Image from "next/image";

const DemosDropdown = () => {
  return (
    <div className="p-4 w-auto">
      <div className="mt-4 text-center">
        <Image
          src="/images/img2.png"
          alt="Demo Slide"
          width={250}
          height={250}
          className="rounded"
        />
        <button className="px-4 py-2 bg-green-600 text-white rounded">
          View Demo
        </button>
      </div>
    </div>
  );
};

export default DemosDropdown;
