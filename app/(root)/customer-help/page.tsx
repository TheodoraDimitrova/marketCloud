"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Banner } from "@/components/ui/Banner";
import Link from "next/link";
import { Search, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/forms/input";

const toCategoryId = (name: string) =>
  `faq-${name.toLowerCase().replace(/ & /g, "-").replace(/\s+/g, "-")}`;

const topics = [
  { topicName: "Ordering", href: "#faq-ordering" },
  { topicName: "Shipping", href: "#faq-shipping" },
  { topicName: "Returns & Exchanges", href: "#faq-returns-exchanges" },
  { topicName: "Product Questions", href: "#faq-products-questions" },
  { topicName: "Order Issues", href: "#faq-order-issues" },
];

const faqData: Array<{
    category: string;
    questions: Array<{
      question: string;
      answer: React.ReactNode;
      searchText: string;
    }>;
  }> = [
    {
      category: "Ordering",
      questions: [
        {
          question: "What if I want to speak to someone?",
          answer: (
            <>
              We want to speak to you too!{" "}
              <Link
                href="/contact-us"
                className="font-medium text-brand underline underline-offset-4"
              >
                Contact us
              </Link>{" "}
              with any questions, concerns, or feedback. We will be sure to get
              back to you within 48 hours. However, please note that inquiries
              sent on Fridays will receive a reply the following Monday, but
              possibly sooner.
            </>
          ),
          searchText:
            "speak to someone contact us questions concerns feedback reply 48 hours",
        },
        {
          question: "Can I cancel my order?",
          answer:
            "Once an order is placed, we are unable to alter or cancel it at this time.",
          searchText:
            "cancel order change order alter order placed unable to cancel",
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
          searchText:
            "shipping time delivery 5-7 business days location courier",
        },
        {
          question: "Do you offer international shipping?",
          answer: "Yes, we ship worldwide with different delivery options.",
          searchText:
            "international shipping worldwide delivery options",
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
          searchText:
            "return policy returns 30 days unused original packaging",
        },
        {
          question: "Can I exchange an item?",
          answer:
            "Yes, exchanges are accepted within 30 days. Please contact our support for assistance.",
          searchText:
            "exchange exchanges 30 days support assistance",
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
          searchText:
            "cruelty-free not tested on animals vegan",
        },
        {
          question: "Do your products contain allergens?",
          answer:
            "Please refer to the ingredient list on each product page for allergen information.",
          searchText:
            "allergens ingredients ingredient list product page",
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
          searchText:
            "damaged item damaged product replacement support photo",
        },
        {
          question: "I didn’t receive my order, what should I do?",
          answer:
            "If your order hasn't arrived within the expected time, please contact our customer service for assistance.",
          searchText:
            "missing order not received order late delivery customer service",
        },
      ],
    },
];

const CustomerHelpPage = () => {
  const [query, setQuery] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<string>(
    toCategoryId(faqData[0]?.category ?? "ordering")
  );

  const normalizedQuery = query.trim().toLowerCase();

  const filteredFaqData = useMemo(() => {
    if (!normalizedQuery) return faqData;

    return faqData
      .map((section) => {
        const questions = section.questions.filter((q) => {
          const haystack = `${q.question} ${q.searchText}`.toLowerCase();
          return haystack.includes(normalizedQuery);
        });
        return { ...section, questions };
      })
      .filter((section) => section.questions.length > 0);
  }, [normalizedQuery]);

  const totalResults = useMemo(() => {
    return filteredFaqData.reduce((sum, section) => sum + section.questions.length, 0);
  }, [filteredFaqData]);

  useEffect(() => {
    // Highlight category in sidebar as you scroll (desktop UX polish)
    const headings = Array.from(
      document.querySelectorAll<HTMLElement>('[id^="faq-"]')
    );
    if (!headings.length) return;
    if (typeof IntersectionObserver === "undefined") return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => (a.boundingClientRect.top ?? 0) - (b.boundingClientRect.top ?? 0))[0];
        if (visible?.target?.id) setActiveCategoryId(visible.target.id);
      },
      { rootMargin: "-20% 0px -70% 0px", threshold: 0.01 }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <Banner
        title="Frequently Asked Questions"
        subtitle="Find answers fast — and if you still need help, our team is one message away."
        backgroundImage="/images/logo1.png"
      />
      <section className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Sidebar (desktop) */}
          <aside className="hidden md:block md:col-span-4 lg:col-span-3">
            <div className="sticky top-24 space-y-6">
              <div>
                <h3 className="mb-3">
                  Browse topics
                </h3>
                <nav className="space-y-1">
                  {topics.map((topic) => {
                    const categoryId = topic.href.replace("#", "");
                    const isActive = activeCategoryId === categoryId;
                    return (
                      <Link
                        key={topic.href}
                        href={topic.href}
                        className={`block rounded-md px-3 py-2 text-sm transition-colors ${
                          isActive
                            ? "bg-brand/10 text-brand font-medium"
                            : "text-gray-600 hover:text-brand hover:bg-gray-50"
                        }`}
                        onClick={() => setActiveCategoryId(categoryId)}
                      >
                        {topic.topicName}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              <div className="rounded-xl border border-gray-200 bg-white p-4">
                <p className="text-sm font-medium text-gray-800">
                  Need 1:1 help?
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  We reply within 48 hours (usually faster).
                </p>
                <Button asChild className="mt-4 w-full">
                  <Link href="/contact-us">Contact support</Link>
                </Button>
              </div>
            </div>
          </aside>

          {/* Main content */}
          <div className="md:col-span-8 lg:col-span-9">
            <header className="mb-6 md:mb-8">
              <p className="text-base text-gray-600">
                Search by keyword or browse by topic. If you can’t find the
                answer, we’re here to help.
              </p>

              {/* Search */}
              <div className="mt-5">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search FAQs (e.g. shipping, return, cancel)"
                    aria-label="Search FAQs"
                    className="pl-10 pr-10"
                    autoComplete="off"
                  />
                  {query.length > 0 && (
                    <button
                      type="button"
                      aria-label="Clear search"
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-gray-400 hover:text-gray-700"
                      onClick={() => setQuery("")}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <div className="mt-2 flex items-center justify-between text-sm text-gray-500">
                  <span>
                    {normalizedQuery
                      ? `${totalResults} result${totalResults === 1 ? "" : "s"}`
                      : "Tip: try “return”, “shipping”, “cancel”"}
                  </span>
                  <Link
                    href="/contact-us"
                    className="font-medium text-brand hover:underline underline-offset-4"
                  >
                    Contact us
                  </Link>
                </div>
              </div>
            </header>

            {filteredFaqData.length === 0 ? (
              <div className="rounded-xl border border-gray-200 bg-white p-6">
                <p className="text-base font-medium text-gray-900">
                  No results found.
                </p>
                <p className="mt-1 text-sm text-gray-600">
                  Try a different keyword or reach out to our team.
                </p>
                <div className="mt-4 flex flex-col sm:flex-row gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setQuery("")}
                  >
                    Clear search
                  </Button>
                  <Button asChild>
                    <Link href="/contact-us">Contact support</Link>
                  </Button>
                </div>
              </div>
            ) : (
              <div className="space-y-10">
                {filteredFaqData.map((section) => {
                  const sectionId = toCategoryId(section.category);
                  return (
                    <section key={section.category} id={sectionId}>
                      <div className="mb-4 flex items-end justify-between gap-4">
                        <h2>
                          {section.category}
                        </h2>
                        <span className="text-sm text-gray-400">
                          {section.questions.length}
                        </span>
                      </div>

                      <div className="rounded-xl border border-gray-200 bg-white divide-y divide-gray-200">
                        {section.questions.map((item, qIndex) => (
                          <details
                            key={`${section.category}-${qIndex}`}
                            className="group px-4 md:px-6"
                          >
                            <summary className="flex cursor-pointer list-none items-start justify-between gap-4 py-5">
                              <span className="text-base md:text-lg font-medium text-gray-800">
                                {item.question}
                              </span>
                              <ChevronDown className="mt-1 h-5 w-5 flex-shrink-0 text-gray-400 transition-transform duration-200 group-open:rotate-180" />
                            </summary>
                            <div className="pb-5 text-sm md:text-base text-gray-600 leading-relaxed">
                              {item.answer}
                            </div>
                          </details>
                        ))}
                      </div>

                      {section.category === "Returns & Exchanges" && (
                        <div className="mt-4">
                          <Button asChild className="w-full sm:w-auto">
                            <Link href="/contact-us">Start a return</Link>
                          </Button>
                        </div>
                      )}
                    </section>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default CustomerHelpPage;
