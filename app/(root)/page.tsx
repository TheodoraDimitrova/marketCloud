import Reviews from "@/components/shared/Reviews/Reviews";
import SectionScrollBanner from "@/components/SectionScrollBanner/SectionScrollBanner";
import SectionHeroslider from "@/components/SectionHeroSlider/SectionHeroSlider";
import OverLapSection from "@/components/OverLapSection/OverLapSection";
import BlogPostsSection from "@/components/BlogPostsSection/BlogPostsSection";
import SectionRichText from "@/components/SectionRichText/SectionRichText";
import SectionCarousel from "@/components/SectonCarousel/SectionCarousel";
import { Heart } from "lucide-react";

const HomePage = () => {
  return (
    <>
      <SectionHeroslider />
      <SectionScrollBanner />
      <SectionRichText
        icon={Heart}
        title="Collections"
        bgColor="bg-white"
        text="Shop our best selling collections for a range of styles loved by you. Whether you're looking to find your perfect fit with our signature swim styles or you're looking for that perfect beachwear cover-up, we've got you covered."
      />
      <SectionCarousel />
      <OverLapSection />
      <BlogPostsSection />
      <Reviews />
    </>
  );
};

export default HomePage;
