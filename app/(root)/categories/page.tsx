"use client";
import Link from "next/link";
import Image from "next/image";
import { fetchCategories } from "@/store/slices/categorySlice";
import { urlFor } from "@/sanity/lib/image";
import Loading from "@/components/shared/Loading";
import { Category } from "@/types/category";
import { useEffect } from "react";
import { useAppSelector } from "@/hooks/useAppSelector";
import { useAppDispatch } from "@/hooks/useAppDispatch";

const CategoriesPage = () => {
  const dispatch = useAppDispatch();
  const { categories, status, error } = useAppSelector(
    (state) => state.categories
  );

  useEffect(() => {
    if (!categories || categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, [dispatch, categories]);

  if (status === "loading") {
    return <Loading />;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6 text-center">
      <h1>All Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 ">
        {categories.map((category: Category) => (
          <Link
            key={category._id}
            href={`/category/${category.slug.current}`}
            className="block py-4  rounded-lg shadow-lg hover:shadow-xl transition"
          >
            <Image
              src={urlFor(category.image)}
              alt={category.name}
              width={300}
              height={200}
              className="w-full rounded-md h-40 object-cover"
            />
            <h3 className="mt-2 text-center">{category.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default CategoriesPage;
