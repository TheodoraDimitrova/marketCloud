import Image from "next/image";

const CartProductSummary = ({ item }) => {
  return (
    <div className="flex items-center w-full">
      <div className="relative min-w-20 min-h-20">
        <Image
          src={item.image}
          alt={item.name}
          fill
          sizes="(max-width: 768px) 50px, 100px"
          className="rounded-md object-cover"
          priority
        />
      </div>
      <div className="flex md:flex-1 ml-3 flex-col">
        <h3 className="text-sm font-medium">{item.name}</h3>
        <p className="text-sm">{item.description}</p>
        <p className="text-sm font-semibold">Color: {item.color}</p>
      </div>
    </div>
  );
};

export default CartProductSummary;
