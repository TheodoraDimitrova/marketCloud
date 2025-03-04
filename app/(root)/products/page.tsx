import Image from "next/image";
import Link from "next/link";

const products = [
  {
    id: "LipstickRedRose",
    name: "Lipstick Red Rose",
    price: "$25",
    image: "/images/lipstick_red_rose.png",
  },
  {
    id: "Moisturizer",
    name: "Moisturizer",
    price: "$30",
    image: "/images/moisturizer.png",
  },
  {
    id: "Shampoo",
    name: "Shampoo",
    price: "$15",
    image: "/images/shampoo.png",
  },
];

const ProductsPage = () => {
  {
    return (
      <div className="container mx-auto p-6 text-center">
        <h1 className="text-3xl font-bold mb-6">All Products</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((product) => (
            <Link
              key={product.id}
              href={`/products/${product.id}`}
              className="block p-4 border rounded-lg shadow-lg hover:shadow-xl transition"
            >
              <Image
                src={product.image}
                alt={product.name}
                width={300}
                height={200}
                className="rounded-lg w-full h-40 object-cover"
              />
              <h2 className="mt-2 text-xl font-semibold">{product.name}</h2>
              <p className="text-gray-600">{product.price}</p>
            </Link>
          ))}
        </div>
      </div>
    );
  }
};

export default ProductsPage;
