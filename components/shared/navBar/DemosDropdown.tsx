import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

const DemosDropdown = () => {
  return (
    <div className="p-4 w-auto flex flex-col md:flex-row items-center">
      <div className="mt-4 text-center">
        <Image
          src="/images/img2.png"
          alt="Demo Slide"
          width={250}
          height={250}
          className="rounded mx-auto"
        />
        <Button className="px-4 py-2 text-white rounded mt-2">View Demo</Button>
      </div>
    </div>
  );
};

export default DemosDropdown;
