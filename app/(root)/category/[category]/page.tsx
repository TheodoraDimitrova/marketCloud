import { notFound } from "next/navigation";
import client from "@/sanity/lib/client";
import CategoryDetails from "@/components/features/categories/CategoryDetails";
import { Category } from "@/types/category";
import { Product } from "@/types/product";

// ✅ Server Component - зарежда данните на сървъра за SEO
const getCategory = async (slug: string): Promise<Category | null> => {
  try {
    const query = `*[_type == "category" && slug.current == $slug][0]`;
    const category = await client.fetch(query, { slug });
    return category;
  } catch (error) {
    console.error("Error fetching category:", error);
    return null;
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
    return [];
  }
};

interface CategoryPageProps {
  params: Promise<{
    category: string;
  }>;
}

const CategoryPage = async ({ params }: CategoryPageProps) => {
  const { category } = await params;

  // ✅ Зарежда категорията и продуктите на сървъра ПРЕДИ рендиране (SEO-friendly)
  const categoryData = await getCategory(category);

  if (!categoryData) {
    notFound();
  }

  // ✅ Зарежда продуктите по категория
  const products = await getProductsByCategory(categoryData._id);

  // ✅ Предава данните на Client Component за интерактивност
  return <CategoryDetails category={categoryData} products={products} />;
};

export default CategoryPage;
