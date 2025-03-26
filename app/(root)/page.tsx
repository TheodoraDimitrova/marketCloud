import Reviews from "@/components/homeSections/Reviews";
import ScrollBanner from "@/components/homeSections/ScrollBanner";
import Heroslider from "@/components/homeSections/HeroSlider";
import OverLapSection from "@/components/homeSections/OverLap";
import BlogPosts from "@/components/homeSections/BlogPosts";
import RichText from "@/components/homeSections/RichText";
import CarouselHome from "@/components/homeSections/CarouselHome";
import { Heart } from "lucide-react";
import HydrateProductsAndCategories from "@/components/HydrateProductsAndCategories";

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
  console.log("Fetching categories... componet index page");
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
