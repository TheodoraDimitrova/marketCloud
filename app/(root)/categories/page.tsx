"use client";
import Link from "next/link";
import Image from "next/image";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategories } from "@/store/slices/categorySlice";
import { RootState } from "@/store/store";
import { useEffect } from "react";
import { urlFor } from "@/sanity/lib/image";

// const categories = [
//   { id: "skincare", name: "Skincare", image: "/images/skincare.png" },
//   { id: "cosmetic-bags", name: "Cosmetic Bags", image: "/images/bag01.png" },
//   { id: "lipsticks", name: "Lipsticks", image: "/images/lipsticks.png" },
//   { id: "makeup-sets", name: "Makeup Sets", image: "/images/set01.png" },
//   { id: "makeup", name: "Makeup", image: "/images/categoryMakeup.png" },
//   { id: "haircare", name: "Haircare", image: "/images/haircare.png" },
// ];

export default function CategoriesPage() {
  const dispatch = useDispatch();
  const { categories, status, error } = useSelector(
    (state: RootState) => state.categories
  );

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchCategories());
    }
  }, [dispatch, status]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6 text-center">
      <h1 className="text-3xl  mb-6">All Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/category/${category.id}`}
            className="block py-4  rounded-lg shadow-lg hover:shadow-xl transition"
          >
            <Image
              src={urlFor(category.image)}
              alt={category.name}
              width={300}
              height={200}
              className="w-full rounded-md h-40 object-cover"
            />
            <h2 className="mt-2 text-xl ">{category.name}</h2>
          </Link>
        ))}
      </div>
    </div>
  );
}
