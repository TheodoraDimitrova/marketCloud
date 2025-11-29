import { Banner } from "@/components/ui/Banner";
import CategoriesCarousel from "@/components/features/categories/categoriesCarousel/CategoriesCarousel";
import HydrateProductsAndCategories from "@/components/providers/HydrateProductsAndCategories";
import ProductsDetails from "@/components/features/products/ProductsDetails";
import client from "@/sanity/lib/client";
import { Product } from "@/types/product";
import { Category } from "@/types/category";
import Link from "next/link";

const getProducts = async (): Promise<Product[]> => {
  try {
    return await client.fetch(`*[_type == "product"]`);
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
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
    return [];
  }
};

const ProductsPage = async () => {
  const products = await getProducts();
  const categories = await getCategories();

  if (!products || products.length === 0) {
    return (
      <>
        <HydrateProductsAndCategories products={[]} categories={categories} />
        <Banner title="Adora Cosmetics" backgroundImage="/images/bg1.png" />
        <div className="container mx-auto p-6 text-center">
          <p className="text-lg text-gray-700">
            Sorry, no products are available right now.
          </p>
          <Link
            href="/"
            className="underline text-red-500 w-full flex justify-center"
          >
            <p>Go To Home Page</p>
          </Link>
        </div>
        <CategoriesCarousel />
      </>
    );
  }

  return (
    <>
      <HydrateProductsAndCategories
        products={products}
        categories={categories}
      />
      <ProductsDetails products={products} categories={categories} />
    </>
  );
};

export default ProductsPage;
