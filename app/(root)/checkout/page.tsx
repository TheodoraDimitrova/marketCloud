"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Ако използваш такъв компонент

const CheckoutPage = () => {
  // Примерни данни за поръчката
  const [cartItems] = useState([
    {
      id: 1,
      name: "Bestswimwear - Sunsets Black Wild Thing Bottom",
      price: 50,
      quantity: 1,
    },
    {
      id: 2,
      name: "Bestswimwear - Sunsets Black Wild Thing Top",
      price: 45,
      quantity: 1,
    },
  ]);
  const totalAmount = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // Състояние за формата
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    postalCode: "",
    phone: "",
    paymentMethod: "Credit Card",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Тук ще обработваме данните от формата (например ще се свържем с API за плащане)
    console.log(formData);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Лявата част (Форма за доставка) */}
      <div className="col-span-2">
        <h1 className="text-3xl font-bold mb-6">Checkout</h1>

        {/* Форма за доставка */}
        <form onSubmit={handleFormSubmit} className="space-y-4">
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>

          <div className="flex flex-col">
            <label htmlFor="fullName" className="text-sm font-semibold">
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="p-3 border rounded-md mt-2"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="address" className="text-sm font-semibold">
              Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="p-3 border rounded-md mt-2"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="postalCode" className="text-sm font-semibold">
              Postal Code
            </label>
            <input
              type="text"
              id="postalCode"
              name="postalCode"
              value={formData.postalCode}
              onChange={handleInputChange}
              className="p-3 border rounded-md mt-2"
              required
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="phone" className="text-sm font-semibold">
              Phone Number
            </label>
            <input
              type="text"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="p-3 border rounded-md mt-2"
              required
            />
          </div>

          {/* Метод на плащане */}
          <div className="flex flex-col">
            <label htmlFor="paymentMethod" className="text-sm font-semibold">
              Payment Method
            </label>
            {/* <select
              id="paymentMethod"
              name="paymentMethod"
              value={formData.paymentMethod}
              onChange={handleInputChange}
              className="p-3 border rounded-md mt-2"
              required
            >
              <option value="Credit Card">Credit Card</option>
              <option value="PayPal">PayPal</option>
              <option value="Stripe">Stripe</option>
            </select> */}
          </div>

          {/* Крайна секция с бутон */}
          <div className="mt-6">
            <Button
              asChild
              className="bg-black text-white py-3 rounded-md w-full"
            >
              <Link href={"/checkout/thank_you"}>Complete Order</Link>
            </Button>
          </div>
        </form>

        <div className="mt-4 text-center">
          <Link href="/shop" className="underline ">
            Continue shopping
          </Link>
        </div>
      </div>

      {/* Дясната част (Order Summary) */}
      <div className="md:col-span-1 p-6 bg-gray-100 rounded-md shadow-md">
        <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
        <ul className="space-y-4">
          {cartItems.map((item) => (
            <li key={item.id} className="flex justify-between">
              <span>
                {item.name} x{item.quantity}
              </span>
              <span>£{(item.price * item.quantity).toFixed(2)}</span>
            </li>
          ))}
        </ul>
        <div className="flex justify-between font-semibold text-lg mt-4">
          <span>Total Amount:</span>
          <span>£{totalAmount.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
