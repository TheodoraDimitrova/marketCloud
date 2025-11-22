import Reviews from "@/components/home/sections/Reviews";
import ScrollBanner from "@/components/home/sections/ScrollBanner";
import Heroslider from "@/components/home/sections/HeroSlider";
import OverLapSection from "@/components/home/sections/Overlap";
import BlogPosts from "@/components/home/sections/BlogPosts";
import RichText from "@/components/home/sections/RichText";
import CarouselHome from "@/components/home/sections/CarouselHome";
import { Heart } from "lucide-react";
import HydrateProductsAndCategories from "@/components/providers/HydrateProductsAndCategories";

const getProducts = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/products`,
    {
      cache: "no-store",
    }
  );
  return res.json();
};

const getCategories = async () => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SERVER_URL}/api/categories`,
    { cache: "no-store" }
  );
  return res.json();
};

const HomePage = async () => {
  const products = await getProducts();
  const categories = await getCategories();
  return (
    <>
      <HydrateProductsAndCategories
        products={products}
        categories={categories}
      />
      <Heroslider />
      <ScrollBanner />
      <RichText
        icon={Heart}
        title="Categories"
        bgColor="bg-white"
        text="Shop our best selling products for a range of styles loved by you.
         Whether you're looking to find your perfect fit with our signature swim
          styles or you're looking for that perfect beachwear cover-up, we've got you covered."
      />
      <CarouselHome />
      <OverLapSection />
      <BlogPosts />
      <Reviews />
    </>
  );
};

export default HomePage;
