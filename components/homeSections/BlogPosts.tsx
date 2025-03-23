import React from "react";
import Image from "next/image";
import Link from "next/link";

const BlogPosts = () => {
  const posts = [
    {
      imageUrl: "/images/post1.png",
      link: "/article1",
      title: "Day vs. Night Makeup: Tips for Every Look",
      text: "Makeup transforms your look, but choosing the right style for day or night is key. Discover how to create a fresh, natural day look and elevate it with drama for evening events. Get inspired by the latest trends and must-have products!",
      author: "Beauty Maven",
      date: "February 1, 2024",
    },
    {
      imageUrl: "/images/post2.png",
      link: "/hair-products",
      title: "Top Hair Products for Healthy, Gorgeous Locks",
      text: "Your hair deserves the best care, whether you're fighting frizz, adding volume, or restoring moisture. In this post, we dive into the must-have hair products that deliver salon-quality results at home",
      author: "Clean Canvas",
      date: "December 12, 2024",
      extraClasses: "md:border-l md:border-gray-400 sm:border-0",
    },
    {
      imageUrl: "/images/post3.png",
      link: "/makeup-brushes",
      title: "The Ultimate Guide to Must-Have Makeup Brushes",
      text: "The right makeup brushes can make all the difference in achieving a flawless look. From foundation blending to precise eyeliner application, discover the essential brushes every beauty lover needs in their collection. We'll share tips for choosing, using, and caring for your brushes to elevate your makeup game!",
      author: "Adora Cosmetics",
      date: "November 1, 2024",
      extraClasses:
        "md:hidden lg:block md:border-l md:border-gray-400 sm:border-0",
    },
  ];

  return (
    <div className="container m-auto flex flex-col h-auto items-center justify-between pb-0 md:pb-12 ">
      <h1>Blog Posts</h1>
      <div className="flex flex-col gap-3 md:flex-row items-stretch justify-center h-full mx-5">
        {posts.map((post, index) => (
          <div
            className={`flex flex-col  flex-grow ${post.extraClasses} px-5`}
            key={index}
          >
            <Image
              src={post.imageUrl}
              alt={post.title}
              width={2500}
              height={1404}
              sizes="(min-width: 1024px) 440px, (min-width: 768px) 50vw, 100vw"
              className="object-cover rounded-lg shadow-lg mb-1"
            />
            <Link href={post.link}>
              <h3 className="text-2xl font-thin mb-4">{post.title}</h3>
            </Link>
            <p className="mb-auto text-justify">{post.text}</p>
            <p className="mt-2">
              {post.date} — {post.author}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogPosts;
