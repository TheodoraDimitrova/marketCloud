import Reviews from "@/components/home/sections/Reviews";
import ScrollBanner from "@/components/home/sections/ScrollBanner";
import Heroslider from "@/components/home/sections/HeroSlider";
import OverlapSection from "@/components/home/sections/Overlap";
import BlogPosts from "@/components/home/sections/BlogPosts";
import RichText from "@/components/home/sections/RichText";
import CarouselHome from "@/components/home/sections/CarouselHome";
import { Heart } from "lucide-react";
import HydrateProductsAndCategories from "@/components/providers/HydrateProductsAndCategories";
import client from "@/sanity/lib/client";

const getProducts = async () => {
  try {
    return await client.fetch(`*[_type == "product"]`);
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

const getCategories = async () => {
  try {
    return await client.fetch(`*[_type == "category"]{
      ...,
      "totalProducts": count(*[_type == "product" && references(^._id)])
    }`);
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
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
      <OverlapSection />
      <BlogPosts />
      <Reviews />
    </>
  );
};

export default HomePage;
