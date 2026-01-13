import ProductsDetails from "@/components/features/products/ProductsDetails";
import client from "@/sanity/lib/client";
import { Product } from "@/lib/types/product";
import { Category } from "@/lib/types/category";

const getProducts = async (): Promise<Product[]> => {
  try {
    return await client.fetch(`*[_type == "product"]{
      ...,
      _createdAt,
      _updatedAt
    }`);
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

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

const ProductsPage = async () => {
  const products = await getProducts();
  const categories = await getCategories();

  return (
    <>
      <ProductsDetails products={products} categories={categories} />
    </>
  );
};

export default ProductsPage;
