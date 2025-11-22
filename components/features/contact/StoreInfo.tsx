import React from "react";
import Link from "next/link";

const StoreInfo = () => {
  return (
    <div className="w-full md:w-1/4 mb-6">
      <h1>Support</h1>
      <p>Mon-Fri 9:00am – 5:00pm </p>
      <p>*Excludes Holidays</p>
      <p className="mt-3">Looking for more info on products?</p>
      <Link href="/customer-help" className="text-gray-400 underline ">
        View FAQs
      </Link>
    </div>
  );
};

export default StoreInfo;
