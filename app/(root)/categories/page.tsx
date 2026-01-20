import Link from "next/link";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import { Category } from "@/lib/types/category";
import client from "@/sanity/lib/client";

const getCategories = async (): Promise<Category[]> => {
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

const CategoriesPage = async () => {
  const categories = await getCategories();

  if (!categories || categories.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6 md:p-6 text-center">
        <h1>All Categories</h1>
        <p>No categories available at the moment.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6 md:p-6 text-center">
      <h1>All Categories</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        {categories.map((category: Category) => (
          <Link
            key={category._id}
            href={`/category/${category.slug.current}`}
            className="block py-3 md:py-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          >
            <Image
              src={urlFor(category.image)}
              alt={category.name}
              width={300}
              height={200}
              className="w-full rounded-md h-48 md:h-40 object-cover"
            />
            <h3 className="mt-3 md:mt-2 text-center text-lg md:text-base font-semibold">{category.name}</h3>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default CategoriesPage;
