import React from "react";
import Logo from "@/components/shared/Logo";
import SocialIcons from "@/components/shared/icons/SocialIcons";

const AboutUsSection = () => {
  return (
    <div className="px-5  pb-5  w-full sm:w-1/2 sm:pb-5 lg:basis-1/4 lg:pb-0">
      <h3 className="text-xl font-semibold mb-4">About the Store</h3>

      <p className="text-wrap ">
        At Adora, we believe beauty has no boundaries, and our mission is to
        provide high-quality, skin-loving products that make you feel radiant
        and beautiful at any age or stage. Whether you're looking for skincare,
        makeup, or haircare, Adora offers products that fit and enhance your
        natural beauty, all while prioritizing comfort and self-expression.
      </p>
      <div className="flex items-center space-x-2 my-8">
        <Logo />
      </div>

      <SocialIcons />
    </div>
  );
};

export default AboutUsSection;
