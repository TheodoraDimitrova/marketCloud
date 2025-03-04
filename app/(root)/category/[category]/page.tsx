import Banner from "@/components/shared/banner/Benner";
import { notFound } from "next/navigation";

const categories = {
  skincare: {
    title: "Skincare",
    description: "Discover the best products for healthy and glowing skin.",
    image: "/images/skincare.png",
  },
  makeup: {
    title: "Makeup",
    description: "Find high-quality makeup for every occasion.",
    image: "/images/categoryMakeup.png",
  },
  haircare: {
    title: "Haircare",
    description: "Professional haircare products for strong and shiny hair.",
    image: "/images/haircare.png",
  },
  "cosmetic-bags": {
    title: "Cosmetic Bags",
    description: "Stylish bags to keep your makeup organized.",
    image: "/images/bag01.png",
  },
  lipsticks: {
    title: "Lipsticks",
    description: "Long-lasting lipsticks in a variety of shades.",
    image: "/images/lipsticks.png",
  },
  "makeup-sets": {
    title: "Makeup Sets",
    description: "Complete makeup sets for a perfect look.",
    image: "/images/set01.png",
  },
  "best-sellers": {
    title: "Best Sellers",
    description: "Our most popular products.",
    image: "/images/bestSellers.png",
  },
  "new-arrivals": {
    title: "New Arrivals",
    description: "Discover the latest additions to our collection.",
    image: "/images/newArrivals.png",
  },
};

type Category = keyof typeof categories;

export default async function CollectionPage({
  params,
}: {
  params: Promise<{ category?: string }>;
}) {
  const { category } = await params;

  if (!category || !(category in categories)) {
    notFound();
  }

  const categoryData = categories[category as Category];

  return (
    <>
      <Banner
        title={categoryData.title}
        subtitle={categoryData.description}
        backgroundImage={categoryData.image}
      />
    </>
  );
}
