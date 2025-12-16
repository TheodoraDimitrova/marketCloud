import React from "react";
import Image from "next/image";
import { Banner } from "@/components/ui/Banner";
import Marquee from "@/components/features/contact/Marquee";
import StoreInfo from "@/components/features/contact/StoreInfo";
import ContactForm from "@/components/features/contact/ContactForm";

const ContactPage = () => {
  return (
    <div className="flex flex-col mx-auto">
      <Banner
        title="Contact Us"
        subtitle="We'd love to hear from you!"
        backgroundImage="/images/products.png"
      />
      <Marquee />

      <div className="container mx-auto flex flex-col justify-center md:flex-row p-8 lg:py-16 lg:px-28 md:space-x-20">
        <StoreInfo />

        <ContactForm />
      </div>

      <div className="flex flex-col md:flex-row h-[360]">
        <div className="flex flex-1 flex-col md:flex-row md:w-1/2">
          <div className="flex-center flex-col w-full md:w-1/2 h-[300px] md:h-[350px] m-auto text-left space-y-3 lg:p-8 bg-slate-200">
            <h1>Our store</h1>
            <p className="mb-3 text-lg">
              123 Fake St. <br />
              Toronto, Canada
            </p>
            <p className="text-md">Mon - Fri, 10am - 9pm</p>
            <p className="text-md">Saturday, 11am - 9pm</p>
            <p className="text-md">Sunday, 11am - 5pm</p>
          </div>
          <div className="w-full md:w-1/2 h-[300px] md:h-[350px] relative">
            <Image
              src="/images/shop.png"
              alt="shop"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          </div>
        </div>
        <div className="w-full h-[300px] md:h-[350px] md:w-1/2 relative">
          <Image
            src="/images/map_location.png"
            alt="shop_location"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, 50vw"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
