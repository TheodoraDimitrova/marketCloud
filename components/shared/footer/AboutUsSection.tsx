import React from "react";
import Logo from "../logo/Logo";
import SocialIcons from "../icons/SocialIcons";

const AboutUsSection = () => {
  return (
    <div className="px-5  pb-5  w-full sm:w-1/2 sm:pb-5 lg:basis-1/4 lg:pb-0">
      <h3 className="text-xl font-semibold mb-4">About the Store</h3>

      <p className="text-wrap ">
        Best Swimwear is a bikini boutique, in sunny Hermosa Beach, California.
        They designed the store with the female in mind.A warm environment where
        instead of feeling self-conscious she feels secure in her own body, not
        limited by age, size or shape, wearing swimwear that fits and feels
        good.
      </p>
      <div className="flex items-center space-x-2 my-8">
        <Logo />
      </div>

      <SocialIcons />
    </div>
  );
};

export default AboutUsSection;
