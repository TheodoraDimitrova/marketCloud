"use client";

import { APP_NAME } from "@/lib/constants/index";
import Link from "next/link";
import FooterNewsLetter from "./FooterNewsLetter";
import FooterPromos from "./FooterPromos";
import CurrencySelect from "./CurrencySelect";
import AboutUsSection from "./AboutUsSection";
import FooterLinkList from "./FooterLinkList";

const Footer = () => {
  const helpLinks = [
    { href: "/contact-us", text: "Contact Us" },
    { href: "/our-blog", text: "Our blog" },
    { href: "/about-us", text: "About Us" },
    { href: "/customer-help", text: "FAQs" },
    { href: "/search", text: "Search" },
  ];

  const shopLinks = [
    { href: "/category", text: "Categories" },
    { href: "/deals", text: "Exclusive Offers" },
    { href: "/products", text: "Products" },
    { href: "/brands", text: "Brands" },
  ];

  return (
    <footer>
      {/* promos */}
      <FooterPromos />

      <div className="bg-black text-white py-16 px-4">
        {/* section footer blocks */}
        <div className="container mx-auto">
          <div className="flex flex-wrap lg:justify-between mb-8 ">
            {/* Column 1: About the Store */}
            <AboutUsSection />

            <div className="flex justify-around  w-full sm:w-1/2 lg:w-auto">
              {/* Column 2: Help */}

              <FooterLinkList title="Help" links={helpLinks} />

              {/* Column 3: Shop */}
              <FooterLinkList title="Shop" links={shopLinks} />
            </div>

            {/* Column 4: Join Our Email List */}
            <FooterNewsLetter />
          </div>
          {/* Divider and Legal Links */}
          <div className="border-t border-gray-600 pt-4 flex justify-between items-center">
            <div className="relative text-gray-400">
              <CurrencySelect />
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

          <div className="items-start mt-8 pt-4">
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
