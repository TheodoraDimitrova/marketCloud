import ProductsDetails from "@/components/features/products/ProductsDetails";
import client from "@/sanity/lib/client";
import { Product } from "@/lib/types/product";
import { Category } from "@/lib/types/category";
import { PRODUCTS_QUERY, CATEGORIES_QUERY } from "@/sanity/queries";

const getProducts = async (): Promise<Product[]> => {
  try {
    return await client.fetch<Product[]>(PRODUCTS_QUERY);
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

const ProductsPage = async () => {
  const products = await getProducts();
  const categories = await getCategories();

  return (
    <>
      <h1 className="sr-only">All Products - Adora Cosmetics</h1>
      <ProductsDetails products={products} categories={categories} />
    </>
  );
};

export default ProductsPage;
