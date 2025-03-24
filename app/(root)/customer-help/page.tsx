import React from "react";
import Banner from "@/components/shared/PageBanner";
import Link from "next/link";
import { Search } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MessageCircleMore } from "lucide-react";
import RichText from "@/components/homeSections/RichText";

const CostomerHepl = () => {
  const topics = [
    { topicName: "Ordering", href: "#faq-ordering" },
    { topicName: "Shipping", href: "#faq-shipping" },
    { topicName: "Returns & Exchanges", href: "#faq-returns-exchanges" },
    { topicName: "Product Questions", href: "#faq-products-questions" },
    { topicName: "Order Issues", href: "#faq-order-issues" },
  ];
  const faqData = [
    {
      category: "Ordering",
      questions: [
        {
          question: "What if I want to speak to someone?",
          answer: (
            <>
              We want to speak to you too!{" "}
              <Link href="/contact-us" className="text-blue-500 underline">
                Contact us
              </Link>{" "}
              with any questions, concerns, or feedback. We will be sure to get
              back to you within 48 hours. However, please note that inquiries
              sent on Fridays will receive a reply the following Monday, but
              possibly sooner.
            </>
          ),
        },
        {
          question: "Can I cancel my order?",
          answer:
            "Once an order is placed, we are unable to alter or cancel it at this time.",
        },
      ],
    },
    {
      category: "Shipping",
      questions: [
        {
          question: "How long does shipping take?",
          answer:
            "Shipping typically takes 5-7 business days depending on your location.",
        },
        {
          question: "Do you offer international shipping?",
          answer: "Yes, we ship worldwide with different delivery options.",
        },
      ],
    },
    {
      category: "Returns & Exchanges",
      questions: [
        {
          question: "What is your return policy?",
          answer:
            "We accept returns within 30 days of purchase. Items must be unused and in original packaging.",
        },
        {
          question: "Can I exchange an item?",
          answer:
            "Yes, exchanges are accepted within 30 days. Please contact our support for assistance.",
        },
      ],
    },
    {
      category: "Products Questions",
      questions: [
        {
          question: "Are your products cruelty-free?",
          answer:
            "Yes, all of our products are 100% cruelty-free and never tested on animals.",
        },
        {
          question: "Do your products contain allergens?",
          answer:
            "Please refer to the ingredient list on each product page for allergen information.",
        },
      ],
    },
    {
      category: "Order Issues",
      questions: [
        {
          question: "What should I do if I receive a damaged item?",
          answer:
            "Please contact our support team with a photo of the damaged item, and we will arrange a replacement.",
        },
        {
          question: "I didn’t receive my order, what should I do?",
          answer:
            "If your order hasn't arrived within the expected time, please contact our customer service for assistance.",
        },
      ],
    },
  ];

  return (
    <>
      <Banner
        title="Customer Help"
        subtitle="If talking to a real-life human is more your thing, you can reach our Customer Happiness Team via email (below)."
        backgroundImage="/images/logo1.png"
      />
      <section className="container max-w-[1200px] flex flex-col mx-auto my-5 md:my-20 md:mt-10">
        {/* FAQ Header Section */}
        <div className="flex justify-between py-16 px-4 lg:py-16 lg:px-32">
          <div className="hidden md:block md:relative md:min-h-screen w-1/4">
            <div className="sticky top-14">
              <h3 className="text-xl mb-2">How can we help?</h3>
              {topics.map((topic, index) => {
                return (
                  <div className="faq-index-item mb-2" key={index}>
                    {" "}
                    <Link
                      className="faq-item__link text-red-400"
                      href={topic.href}
                    >
                      {topic.topicName}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* FAQ Header Content Section */}
          <div className="flex flex-col flex-grow w-3/4 ">
            <h1>FAQ</h1>

            <p className="text-wrap justify-center">
              We might have already read your mind. Use the search to find what
              you are looking for.
            </p>

            {/* FAQ Search Section */}
            <div className="faq-search flex items-center space-x-2  p-2 border border-gray-300 rounded-md w-full mt-4">
              <Search />
              <input
                type="text"
                className="focus:outline-none"
                // value={searchQuery}
                // onChange={handleSearchChange}
                autoComplete="off"
                placeholder="Search FAQ"
                aria-label="Search FAQ"
              />
            </div>

            <div className="pt-5 my-8">
              {faqData.map((section, index) => (
                <div
                  key={index}
                  id={`faq-${section.category
                    .toLowerCase()
                    .replace(/ & /g, "-")
                    .replace(/\s+/g, "-")}`}
                  className="mb-10"
                >
                  <h4 className="text-2xl mt-10 mb-5 ">{section.category}</h4>{" "}
                  {section.questions.map((item, qIndex) => (
                    <div key={qIndex} className="border-b border-gray-300 ">
                      <details className="group  ">
                        <summary className="flex justify-between items-center cursor-pointer  text-xl  text-gray-500 py-5">
                          {item.question}
                          <span className="text-3xl font-bold transition-all  text-gray-500 duration-300 group-open:hidden">
                            <ChevronUp />
                          </span>
                          <span className="text-3xl font-bold transition-all  text-gray-500 duration-300 hidden group-open:block">
                            <ChevronDown />
                          </span>
                        </summary>
                        <div className="p-4 text-gray-600 max-h-0 overflow-hidden transition-all duration-500 ease-out group-open:max-h-96">
                          {item.answer}
                        </div>
                      </details>
                    </div>
                  ))}
                  {section.category === "Returns & Exchanges" && (
                    <Button asChild className="w-60 mt-4">
                      <Link href="/contact-us" className="uppercase">
                        Start a return
                      </Link>
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <RichText
        icon={MessageCircleMore}
        title="Get in touch"
        text="Have questions about your order, or a general enquiry?"
        buttonText="Contact us"
        buttonLink="/contact-us"
      />
    </>
  );
};

export default CostomerHepl;
