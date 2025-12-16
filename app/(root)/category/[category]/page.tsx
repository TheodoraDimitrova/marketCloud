import { notFound } from "next/navigation";
import client from "@/sanity/lib/client";
import CategoryDetails from "@/components/features/categories/CategoryDetails";
import { Category } from "@/lib/types/category";
import { Product } from "@/lib/types/product";
import { urlFor } from "@/sanity/lib/image";

const getCategory = async (slug: string): Promise<Category | null> => {
  try {
    const query = `*[_type == "category" && slug.current == $slug][0]`;
    const category = await client.fetch(query, { slug });
    return category;
  } catch (error) {
    console.error("Error fetching category:", error);
    throw error;
  }
};

const getProductsByCategory = async (
  categoryId: string
): Promise<Product[]> => {
  try {
    const query = '*[_type == "product" && references($categoryId)]';
    const products = await client.fetch(query, { categoryId });
    return products;
  } catch (error) {
    console.error("Error fetching products by category:", error);
    throw error;
  }
};

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { category } = await params;

  const categoryData = await getCategory(category);

  if (!categoryData) {
    notFound();
  }

  const products = await getProductsByCategory(categoryData._id);

  // Generate image URL on server
  const categoryImageUrl = categoryData.image
    ? urlFor(categoryData.image)
    : undefined;

  return (
    <CategoryDetails
      category={categoryData}
      products={products}
      categoryImageUrl={categoryImageUrl}
    />
  );
};

export default CategoryPage;
