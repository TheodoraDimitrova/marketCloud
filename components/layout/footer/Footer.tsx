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
    { href: "/products", text: "Search" },
  ];

  const shopLinks = [
    { href: "/categories", text: "Categories" },
    { href: "/deals", text: "Exclusive Offers" },
    { href: "/products", text: "Products" },
    { href: "/brands", text: "Brands" },
    { href: "/products?sort=newest", text: "New Arrivals" },
  ];

  return (
    <footer id="footer">
      {/* promos */}
      <FooterPromos />

      <div className="bg-black text-white py-12 px-4">
        {/* section footer blocks */}
        <div className="container mx-auto">
          <div className="flex flex-wrap lg:justify-between mb-6 ">
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
          {/* Bottom Section */}
          <div className="border-t border-gray-600 pt-5 mt-6">
            {/* Mobile & Tablet: Stack vertically, Desktop: Grid 3 columns */}
            <div className="flex flex-col gap-5 text-center md:grid md:grid-cols-3 md:gap-4 md:items-center md:text-left">
              {/* Mobile: Copyright first, Desktop: Currency left */}
              <div className="order-2 md:order-1 md:justify-self-start flex justify-center md:justify-start">
                <CurrencySelect />
              </div>

              {/* Center: Copyright */}
              <div className="order-1 md:order-2 md:justify-self-center md:text-center">
                <p className="text-[#fff]">
                  © {new Date().getFullYear()} {APP_NAME}. All Rights Reserved.
                </p>
              </div>

              {/* Right: Legal Links */}
              <div className="order-3 md:justify-self-end flex gap-4 justify-center md:justify-end">
                <Link
                  href="/policies/privacy-policy"
                  className="text-[#8C8C8C] opacity-75 hover:opacity-100 hover:text-white transition-all"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/policies/terms-of-service"
                  className="text-[#8C8C8C] opacity-75 hover:opacity-100 hover:text-white transition-all"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
