import React from "react";
import { Logo } from "@/components/ui/Logo";
import SocialIcons from "@/components/shared/icons/SocialIcons";

const AboutUsSection = () => {
  return (
    <div className="px-3  pb-5  w-full sm:w-1/2 sm:pb-5 lg:basis-1/4 lg:pb-0">
      <h3 className="text-white">About the Store</h3>

      <p className="text-wrap text-white">
        At Adora, we believe beauty has no boundaries. We provide high-quality
        products that make you feel radiant and beautiful at any age.
      </p>
      <div className="flex items-center space-x-2 my-6 opacity-80">
        <Logo width={140} height={19} />
      </div>

      <div className="mt-6">
        <h4 className="text-white">Follow Us</h4>
        <SocialIcons />
      </div>
    </div>
  );
};

export default AboutUsSection;
