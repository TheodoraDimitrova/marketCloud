"use client";
import React from "react";
import Image from "next/image";
import Head from "next/head";
import Banner from "@/components/shared/PageBanner";
import Marquee from "@/components/ContactPage/Marquee";
import StoreInfo from "@/components/ContactPage/StoreInfo";
import ContactForm from "@/components/ContactPage/ContactForm";

const ContactPage = () => {
  return (
    <div className="flex flex-col mx-auto">
      {/* SEO  */}
      <Head>
        <title>Contact Us</title>
        <meta
          name="description"
          content="Get in touch with us for any inquiries or support. We're here to help!"
        />
      </Head>
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
          <div className="flex flex-col w-full md:w-1/2 h-[300px] md:h-[350px] m-auto items-center justify-center text-left space-y-3 lg:p-8  bg-slate-200">
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
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 30vw, 33vw"
            />
          </div>
        </div>
        <div className="w-full h-[300px] md:h-[350px] md:w-1/2 relative">
          <Image
            src="/images/map_location.png"
            alt="shop_location"
            fill
            className="object-cover"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 30vw, 33vw"
          />
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
