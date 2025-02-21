"use client";

import Logo from "../logo/Logo";
import { APP_NAME } from "@/lib/constants/index";
import Link from "next/link";
import SocialIcons from "../icons/SocialIcons";
import { Truck } from "lucide-react";
import { Tag } from "lucide-react";
import { Gift } from "lucide-react";
import { Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  return (
    <footer>
      {/* promos */}
      <div className="bg-[#fcfaf3] text-black py-5 px-2 md:px-20">
        <div className="container mx-auto flex flex-wrap justify-between ">
          <div className="w-1/2 pb-5 md:w-1/4 md:pb-0 flex flex-col items-center ">
            <Link href="/delivery">
              <div className="relative">
                <div className="flex flex-col items-center">
                  <Truck />
                  <div className="text-center">
                    <h6 className="mt-1">Free shipping</h6>
                  </div>
                </div>
              </div>
            </Link>
          </div>
          <div className="w-1/2 pb-5 md:w-1/4 md:pb-0 flex flex-col items-center">
            <Link href="/delivery">
              <div className="relative">
                <div className="flex flex-col items-center">
                  <Tag />
                  <div className="text-center">
                    <h6 className="mt-1">New styles</h6>
                  </div>
                </div>
              </div>
            </Link>
          </div>
          <div className="w-1/2  md:w-1/4  flex flex-col items-center">
            <Link href="/delivery">
              <div className="relative">
                <div className="flex flex-col items-center">
                  <Gift />
                  <div className="text-center">
                    <h6 className="mt-1">Gift Cards</h6>
                  </div>
                </div>
              </div>
            </Link>
          </div>
          <div className="w-1/2  md:w-1/4  flex flex-col items-center">
            <Link href="/delivery">
              <div className="relative">
                <div className="flex flex-col items-center">
                  <Star />
                  <div className="text-center">
                    <h6 className="mt-1">5.0 star rating</h6>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>

      <div className="bg-black text-white py-16 px-4">
        {/* section footer blocks */}
        <div className="container mx-auto ">
          <div className="flex flex-wrap lg:justify-between ">
            {/* Column 1: About the Store */}
            <div className="px-5  pb-5  w-full sm:w-1/2 sm:pb-5 lg:basis-1/4 lg:pb-0">
              <h3 className="text-xl font-semibold mb-4">About the Store</h3>

              <p className="text-wrap ">
                Best Swimwear is a bikini boutique, in sunny Hermosa Beach,
                California. They designed the store with the female in mind.A
                warm environment where instead of feeling self-conscious she
                feels secure in her own body, not limited by age, size or shape,
                wearing swimwear that fits and feels good.
              </p>
              <div className="flex items-center space-x-2 my-8">
                <Logo />
              </div>

              <SocialIcons />
            </div>

            {/* Column 2: Help */}
            <div className="px-5 mr-20 sm:mr-0 sm:w-1/2 pb-5 lg:w-auto lg:pb-0">
              <h3 className="text-xl font-semibold mb-4">Help</h3>
              <ul>
                <li>
                  <Link
                    href="/contact-us"
                    className="text-gray-400 hover:text-white hover:underline"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/blogs"
                    className="text-gray-400 hover:text-white hover:underline"
                  >
                    Our blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about-us"
                    className="text-gray-400 hover:text-white hover:underline"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/customer-help"
                    className="text-gray-400 hover:text-white hover:underline"
                  >
                    FAQs
                  </Link>
                </li>
                <li>
                  <Link
                    href="/search"
                    className="text-gray-400 hover:text-white hover:underline"
                  >
                    Search
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 3: Shop */}
            <div className="px-5 sm:w-1/2 pb-5 lg:w-auto lg:pb-0">
              <h3 className="text-xl font-semibold mb-4">Shop</h3>
              <ul>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white hover:underline"
                  >
                    Swim Tops
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white hover:underline"
                  >
                    Swim Bottoms
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white hover:underline"
                  >
                    One Pieces
                  </Link>
                </li>
                <li>
                  <Link
                    href="#"
                    className="text-gray-400 hover:text-white hover:underline"
                  >
                    Cover-ups
                  </Link>
                </li>
              </ul>
            </div>

            {/* Column 4: Join Our Email List */}
            <div className="px-5  pb-5  w-full sm:w-1/2 sm:pb-5 lg:basis-1/4 lg:pb-0">
              <h3 className="text-xl font-semibold mb-4">
                Join Our Email List
              </h3>
              <p className="text-white mb-4">
                Get 20% off your first purchase! Plus, be the first to know
                about sales, new product launches, and exclusive offers!
              </p>
              <div className="flex flex-col space-y-2 w-full ">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-2 text-black "
                />
                <Button>Subscribe</Button>
              </div>
            </div>
          </div>

          {/* Divider and Legal Links */}
          <div className="border-t border-gray-600 mt-8 pt-4 flex justify-between items-center">
            <div className="text-gray-400">
              <select className="bg-gray-800 text-white border-none py-2 px-4 rounded-md">
                <option>USD</option>
                <option>EUR</option>
                <option>GBP</option>
              </select>
            </div>
            <div className="flex flex-col sm:flex-row sm:space-x-4 text-gray-400">
              <Link
                href="/policies/privacy-policy"
                className="hover:text-white"
              >
                Privacy Policy
              </Link>
              <Link
                href="/policies/terms-of-service"
                className="hover:text-white"
              >
                Terms of Service
              </Link>
            </div>
          </div>
          <div className=" items-start mt-8 pt-4">
            <p>
              © {new Date().getFullYear()} {APP_NAME}. All Rights Reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
