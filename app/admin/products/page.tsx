import Products from "./Products";
import client from "@/sanity/lib/client";
import { PRODUCTS_QUERY, CATEGORIES_QUERY, CATEGORIES_BY_IDS_QUERY } from "@/sanity/queries";
import { sanityProductToAdmin } from "@/lib/services/adminProducts";
import type { AdminProduct } from "@/lib/types/adminProduct";
import type { Category } from "@/lib/types/category";

/** Raw product from Sanity (category may be ref or expanded) */
interface RawSanityProduct {
  _id?: string;
  category?: { _ref?: string; _id?: string; name?: string };
  [key: string]: unknown;
}

const getProducts = async (): Promise<AdminProduct[]> => {
  try {
    const raw = await client.fetch<RawSanityProduct[]>(PRODUCTS_QUERY);

    // Expand categories for admin mapping (needed for category name)
    const categoryRefs = new Set<string>();
    raw.forEach((p: RawSanityProduct) => {
      if (p.category?._ref) {
        categoryRefs.add(p.category._ref);
      }
    });

    // Batch fetch all categories at once
    const categoriesMap = new Map<string, Pick<Category, "_id" | "name">>();
    if (categoryRefs.size > 0) {
      const categoryIds = Array.from(categoryRefs);
      const categories = await client.fetch<Pick<Category, "_id" | "name">[]>(
        CATEGORIES_BY_IDS_QUERY,
        { ids: categoryIds }
      );
      categories.forEach((cat) => {
        categoriesMap.set(cat._id, cat);
      });
    }

    // Map categories to products
    const productsWithCategories = raw.map((p: RawSanityProduct) => {
      const item = { ...p };
      if (item.category?._ref && categoriesMap.has(item.category._ref)) {
        item.category = categoriesMap.get(item.category._ref);
      }
      return item;
    });

    const seen = new Set<string>();
    const mapped: AdminProduct[] = [];
    for (const p of productsWithCategories) {
      const doc = p as { _id?: string };
      if (!doc._id) continue;
      if (seen.has(doc._id)) continue;
      seen.add(doc._id);
      mapped.push(sanityProductToAdmin(p as Parameters<typeof sanityProductToAdmin>[0]));
    }
    return mapped;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

const getCategories = async (): Promise<Category[]> => {
  try {
    return await client.fetch<Category[]>(CATEGORIES_QUERY);
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
};

const AdminProductsPage = async () => {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return <Products initialProducts={products} initialCategories={categories} />;
};

export default AdminProductsPage;
