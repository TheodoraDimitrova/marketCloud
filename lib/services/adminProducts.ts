import type { AdminProduct, SanityProduct } from "@/lib/types/adminProduct";
import { urlFor } from "@/sanity/lib/image";

export function sanityProductToAdmin(product: SanityProduct): AdminProduct {
  const hasStock = (product.stock ?? 0) > 0;
  const status: "Active" | "Draft" | "Out of stock" = hasStock
    ? "Active"
    : "Out of stock";

  // Get first image URL or use placeholder
  let imageUrl: string | undefined;
  if (product.images && product.images.length > 0 && product.images[0]) {
    const image = product.images[0];
    const ref = image.asset?._ref;
    if (ref) {
      imageUrl = urlFor(
        { asset: { _ref: ref } },
        { width: 160, height: 160, quality: 85, format: "webp" }
      );
    }
  }

  return {
    id: product._id,
    name: product.name || "Untitled Product",
    description: product.description,
    price: product.price ?? 0,
    image: imageUrl,
    status,
    stock: product.stock,
    sku: product.sku,
    brand: product.brand,
    category: product.category?.name,
  };
}
