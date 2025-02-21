"use client";
import React, { useState } from "react";
import Banner from "@/components/shared/banner/Benner";
import Marquee from "@/components/shared/marquee/Marquee";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import Link from "next/link";
import Head from "next/head";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { px } from "framer-motion";

const ContactPage = () => {
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex flex-col mx-auto">
      {/* SEO  */}
      <Head>
        <title>Contact Us</title>
        <meta
          name="description"
          content="Get in touch with us for any inquiries or support. We're here to help!"
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Banner
        title="Contact Us"
        subtitle="We'd love to hear from you!"
        backgroundImage="/images/products.png"
      />
      <Marquee />

      <div className="container mx-auto flex flex-col justify-center md:flex-row p-8 lg:py-16 lg:px-28 md:space-x-20">
        <div className="w-full md:w-1/4 mb-6">
          <h1>Support</h1>
          <p>Mon-Fri 9:00am – 5:00pm </p>
          <p>*Excludes Holidays</p>
          <p className="mt-3">Looking for more info on products?</p>
          <Link href="/customer-help" className="text-gray-400 underline ">
            View FAQs
          </Link>
        </div>

        <div className="flex flex-col md:w-3/4 ">
          <h1>Contact us</h1>
          <p>
            Drop your details below and we&apos;ll get back to you within a day.
          </p>
          {/* form */}
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4 my-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  type="text"
                  className="rounded w-full "
                  autoComplete="off"
                  aria-label="Your Name"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  className="rounded w-full "
                  autoComplete="off"
                  aria-label="Your Email"
                />
              </div>

              <div>
                <Label>Type of enquiry</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem
                      value="returns"
                      className=" focus:bg-gray-200 data-[state=checked]:bg-gray-200"
                    >
                      Aftersales & Returns
                    </SelectItem>
                    <SelectItem
                      value="delivery"
                      className=" focus:bg-gray-200 data-[state=checked]:bg-gray-200"
                    >
                      Delivery & Collection
                    </SelectItem>
                    <SelectItem
                      value="support"
                      className=" focus:bg-gray-200 data-[state=checked]:bg-gray-200"
                    >
                      Product Support
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="order_number" className="block pb-2">
                  Order number (optional)
                </Label>
                <Input
                  type="text"
                  className="rounded w-full "
                  name="order_number"
                  autoComplete="off"
                  aria-label="Order number (optional)"
                />
              </div>
            </div>

            <div className="flex flex-col">
              <div>
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="Type your message here." />
              </div>

              <div className="flex items-center gap-2 m-4">
                <Checkbox checked={checked} onCheckedChange={setChecked} />
                <span>Send me email marketing of legitimate interest</span>
              </div>
              <div className="inline-flex items-center">
                <Button className="uppercase" type="submit">
                  Send
                </Button>
              </div>
            </div>
          </form>
        </div>
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
