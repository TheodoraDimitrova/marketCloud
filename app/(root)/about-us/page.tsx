import Banner from "@/components/shared/PageBanner";
import Image from "next/image";

export default function AboutPage() {
  return (
    <section className="mx-auto my-5 md:my-20 md:mt-10 max-w-3xl px-4">
      <Banner title="About Us" />

      <div className="flex flex-col space-y-6">
        <div className="flex justify-center mb-6">
          <Image
            src="/images/Products.png"
            alt="Products Adora"
            width={400}
            height={250}
            style={{ width: "auto", height: "auto" }}
            className="rounded-lg shadow-lg"
          />
        </div>

        <p className="text-lg leading-relaxed text-gray-700">
          Welcome to <strong>Adora</strong>, your go-to destination for
          high-quality cosmetics! We were created with one mission in mind: to
          bring you the best of the beauty and skincare world, so you can feel
          confident and special every day.
        </p>

        <h3 className="text-2xl font-semibold text-gray-800 mt-6">
          Our Vision
        </h3>
        <p className="text-lg leading-relaxed text-gray-700">
          At <strong>Adora</strong>, we believe that every woman deserves to
          feel beautiful and have access to the best products available. That’s
          why we offer not only products from established brands but also our
          very own <strong>private-label cosmetics</strong>, created with
          attention to every detail and the latest technologies.
        </p>

        <h3 className="text-2xl font-semibold text-gray-800 mt-6">
          What We Offer
        </h3>
        <p className="text-lg leading-relaxed text-gray-700">
          Our selection includes a variety of{" "}
          <strong>skincare, body care, and hair care products</strong> designed
          for your convenience and effectiveness. Each product is carefully
          formulated to deliver optimal results, highlighting your natural
          beauty. From hydrating creams and serums to hair care products, we
          have everything you need to look and feel amazing.
        </p>

        <h3 className="text-2xl font-semibold text-gray-800 mt-6">
          Why Choose Adora?
        </h3>
        <ul className="list-disc pl-5 space-y-2 text-lg text-gray-700">
          <li>
            <strong>Private Label</strong>: Our products are specially developed
            and manufactured with a focus on quality and the latest beauty
            trends.
          </li>
          <li>
            <strong>High-Quality Ingredients</strong>: We use only the finest
            ingredients to ensure gentle and effective care for your skin and
            hair.
          </li>
          <li>
            <strong>Professionalism</strong>: You can rely on our experts for
            excellent advice and recommendations to help you find the perfect
            products for your skin and hair type.
          </li>
        </ul>

        <h3 className="text-2xl font-semibold text-gray-800 mt-6">
          Our Commitment to You
        </h3>
        <p className="text-lg leading-relaxed text-gray-700">
          At <strong>Adora</strong>, we strive to offer not only high-quality
          products but also exceptional customer service. Your satisfaction is
          our top priority, and we work hard to ensure you have the best online
          shopping experience. We are here to help you choose the products that
          best meet your needs and preferences.
        </p>
      </div>
    </section>
  );
}
