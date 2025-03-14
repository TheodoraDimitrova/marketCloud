"use client";
import Link from "next/link";
import Image from "next/image";
import { useSelector } from "react-redux";
import { useFetchData } from "@/hooks/useFetchData";
import { fetchCategories } from "@/store/slices/categorySlice";
import { urlFor } from "@/sanity/lib/image";
import { RootState } from "@/store/store";
import Loading from "@/components/shared/loading/loading";

const CategoriesPage = () => {
  const { status, error } = useFetchData(fetchCategories, "categories");
  const { categories } = useSelector((state: RootState) => state.categories);

  if (status === "loading") {
    return <Loading />;
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
};
export default CategoriesPage;
