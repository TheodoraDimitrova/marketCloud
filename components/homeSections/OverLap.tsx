import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const OverLap = () => {
  return (
    <section className="flex h-auto flex-col md:flex-row items-center  justify-between pt-0 md:py-12 p-5">
      {/* Left side: Overlapping images */}
      <div className="w-full md:w-1/2 ">
        <div className="w-full flex items-center justify-center p-5">
          <div className="relative mt-20 p-15 z-10 ">
            <Image
              src="/images/img5.png"
              alt="image1"
              width={200}
              height={250}
              style={{ width: "100%", height: "auto" }}
              sizes="(max-width: 768px) 50vw, (min-width: 1600px) 350px, 50vw"
              className="rounded-[10px] shadow-lg h-[350px]"
            />
          </div>

          <div className="relative z-1  -ml-10">
            <Image
              src="/images/img6.png"
              alt="Sustainability"
              width={200}
              height={250}
              style={{ width: "100%", height: "auto" }}
              sizes="(max-width: 768px) 50vw, (min-width: 1600px) 350px, 50vw"
              className="rounded-[10px] shadow-lg h-[300px]"
            />
          </div>
        </div>
      </div>

      {/* Right side: Text content */}
      <div className="w-full md:w-1/2 text-center md:text-left mt-8 md:mt-0 flex text-wrap md:p-20 ">
        <div className="lg:w-[600px] md:w-[300px]">
          <h2 className="text-2xl sm:text-2xl md:text-3xl lg:text-4xl mb-6 ">
            Techniques & Styles
          </h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Explore the art of makeup with expert techniques and stunning
            styles. Whether you’re looking for a natural daytime glow or
            glamorous evening elegance, we’ve got you covered.
          </p>
          <div className="flex flex-col space-y-4 md:items-start items-center">
            <Link href="/learn-more " className="link underline">
              Learn more
            </Link>
            <Button asChild className="w-60">
              <Link href="/shop-colection">Shop the collection</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OverLap;
