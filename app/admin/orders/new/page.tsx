"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import TopBar from "@/components/admin/layout/TopBar";
import { Button } from "@/components/admin/ui/button";
import { Input } from "@/components/admin/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/admin/ui/select";
import { ArrowLeft, Plus, X, Loader2, Search } from "lucide-react";
import type { Product } from "@/lib/types/product";
import type { CartItem } from "@/lib/types/cart";
import {
  calculateDiscountedPrice,
  calculateSubtotal,
  calculateTotalSavings,
} from "@/lib/calculateCheckout";
import { prepareOrderData } from "@/lib/services/orderService";
import type { FormValues } from "@/lib/types/formValues";
import type { CartState } from "@/lib/types/cart";

const CreateOrderPage = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState<CartItem[]>([]);

  // Customer info (same as root checkout form)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  // Shipping address
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [postalCode, setPostalCode] = useState("");
  const [country, setCountry] = useState("");

  // Payment & shipping (aligned with root)
  const [paymentStatus, setPaymentStatus] = useState("paid");
  const [shippingMethod, setShippingMethod] = useState("");
  const [shippingCost, setShippingCost] = useState(0);
  const [shippingLabel, setShippingLabel] = useState("");

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch("/api/admin/products");
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    }
    fetchProducts();
  }, []);

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  /** Build CartItem from Product (same shape as root cart) */
  const productToCartItem = (product: Product, quantity: number): CartItem => {
    const imageRef =
      product.images?.length && product.images[0]?.asset?._ref
        ? product.images[0].asset._ref
        : "";
    const discount = product.discount?.isActive
      ? {
          amount: product.discount.amount,
          isActive: true,
          type: product.discount.type,
        }
      : undefined;
    const item: CartItem = {
      _id: product._id,
      name: product.name,
      price: product.price,
      quantity,
      images: imageRef ? [{ asset: { _ref: imageRef } }] : [],
      discount,
    };
    const discountedPrice = calculateDiscountedPrice(item);
    return {
      ...item,
      discountedPrice,
      subtotalSingleProduct: discountedPrice * quantity,
      totalPrice: discountedPrice * quantity,
    };
  };

  const addToCart = (product: Product) => {
    const existing = cart.find((item) => item._id === product._id);
    if (existing) {
      updateQuantity(product._id, existing.quantity + 1);
      return;
    }
    const newItem = productToCartItem(product, 1);
    setCart([...cart, newItem]);
  };

  const removeFromCart = (productId: string) => {
    setCart(cart.filter((item) => item._id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const item = cart.find((i) => i._id === productId);
    if (!item) return;
    const product = products.find((p) => p._id === productId);
    if (product) {
      const updated = productToCartItem(product, quantity);
      setCart(cart.map((i) => (i._id === productId ? updated : i)));
    } else {
      const discountedPrice = item.discountedPrice ?? item.price;
      setCart(
        cart.map((i) =>
          i._id === productId
            ? {
                ...i,
                quantity,
                discountedPrice,
                subtotalSingleProduct: discountedPrice * quantity,
                totalPrice: discountedPrice * quantity,
              }
            : i
        )
      );
    }
  };

  // Same calculation as root (calculateSubtotal, calculateTotalSavings)
  const subtotal = calculateSubtotal(cart);
  const totalSavings = calculateTotalSavings(cart);
  const totalAmount = subtotal + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Please add at least one product to the order");
      return;
    }

    setLoading(true);
    try {
      const paymentMethod = paymentStatus === "paid" ? "card" : "cash";
      const formData: FormValues = {
        contact: email,
        email,
        firstName,
        lastName,
        address,
        postalCode,
        city,
        country,
        phone,
        subscribed,
        saveAddress: false,
        deliveryMethod: shippingMethod || "",
        paymentMethod,
      };
      const cartState: CartState = {
        items: cart,
        subtotal,
        totalSavings,
        totalAmount,
        shipping: {
          method: shippingMethod || null,
          cost: shippingCost,
          label: shippingLabel || shippingMethod || "",
        },
      };
      const orderData = prepareOrderData(formData, cartState);

      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create order");
      }

      const data = await res.json();
      router.push(`/admin/orders/${data.createdOrder._id}`);
    } catch (error) {
      console.error("Error creating order:", error);
      alert(error instanceof Error ? error.message : "Failed to create order");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <TopBar title="Create New Order" breadcrumbs={[{ label: "Orders", href: "/admin/orders" }]} />
      <main className="flex-1 p-6">
        <button
          onClick={() => router.push("/admin/orders")}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back to orders
        </button>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left column - Customer & Shipping */}
            <div className="lg:col-span-2 space-y-6">
              {/* Customer Information */}
              <div className="bg-card rounded-lg border border-border p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">Customer Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">First Name *</label>
                    <Input
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      required
                      className="bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Last Name *</label>
                    <Input
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      className="bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Email *</label>
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="bg-background"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Phone *</label>
                    <Input
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      required
                      className="bg-background"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={subscribed}
                        onChange={(e) => setSubscribed(e.target.checked)}
                        className="rounded"
                      />
                      <span className="text-xs text-muted-foreground">Subscribe to newsletter</span>
                    </label>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-card rounded-lg border border-border p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">Shipping Address</h3>
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Address *</label>
                    <Input
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      required
                      className="bg-background"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">City *</label>
                      <Input
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        required
                        className="bg-background"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-muted-foreground mb-1 block">Postal Code *</label>
                      <Input
                        value={postalCode}
                        onChange={(e) => setPostalCode(e.target.value)}
                        required
                        className="bg-background"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Country *</label>
                    <Input
                      value={country}
                      onChange={(e) => setCountry(e.target.value)}
                      required
                      className="bg-background"
                    />
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className="bg-card rounded-lg border border-border p-5">
                <h3 className="text-sm font-semibold text-foreground mb-4">Add Products</h3>
                <div className="relative mb-4">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-background"
                  />
                </div>
                <div className="max-h-60 overflow-y-auto space-y-2">
                  {filteredProducts.slice(0, 20).map((product) => {
                    const hasDiscount = product.discount?.isActive && product.discount?.amount;
                    const discountedPrice = hasDiscount
                      ? product.discount!.type === "percentage"
                        ? product.price - (product.price * product.discount!.amount) / 100
                        : product.price - product.discount!.amount
                      : product.price;
                    const discountLabel = hasDiscount
                      ? product.discount!.type === "percentage"
                        ? `-${product.discount!.amount}%`
                        : `-${product.discount!.amount}€`
                      : null;
                    return (
                      <div
                        key={product._id}
                        className="flex items-center justify-between p-2 hover:bg-muted/50 rounded"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{product.name}</p>
                          <div className="flex items-center gap-2 flex-wrap mt-0.5">
                            {hasDiscount ? (
                              <>
                                <span className="text-xs text-muted-foreground line-through">
                                  {product.price.toFixed(2)} EUR
                                </span>
                                <span className="text-xs font-medium text-green-600">
                                  {discountedPrice.toFixed(2)} EUR
                                </span>
                                <span className="text-xs font-medium text-green-600 bg-green-600/10 px-1.5 py-0.5 rounded">
                                  {discountLabel}
                                </span>
                              </>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                {product.price.toFixed(2)} EUR
                              </span>
                            )}
                          </div>
                        </div>
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => addToCart(product)}
                          className="shrink-0 ml-2"
                        >
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Cart */}
              {cart.length > 0 && (
                <div className="bg-card rounded-lg border border-border p-5">
                  <h3 className="text-sm font-semibold text-foreground mb-4">Order Items</h3>
                  <div className="space-y-3">
                    {cart.map((item) => {
                      const price = item.discountedPrice ?? item.price;
                      const lineTotal = price * item.quantity;
                      return (
                      <div
                        key={item._id}
                        className="flex items-center justify-between p-3 border border-border rounded"
                      >
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {price.toFixed(2)} EUR × {item.quantity} ={" "}
                            {lineTotal.toFixed(2)} EUR
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => item._id && updateQuantity(item._id, item.quantity - 1)}
                          >
                            -
                          </Button>
                          <span className="w-8 text-center text-sm">{item.quantity}</span>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => item._id && updateQuantity(item._id, item.quantity + 1)}
                          >
                            +
                          </Button>
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => item._id && removeFromCart(item._id)}
                            className="text-destructive"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Right column - Payment & Summary */}
            <div className="space-y-6">
              <div className="bg-card rounded-lg border border-border p-5 space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Payment & Shipping</h3>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Payment Status *</label>
                  <Select value={paymentStatus} onValueChange={setPaymentStatus}>
                    <SelectTrigger className="bg-background">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card z-50">
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="unpaid">Unpaid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Shipping Method</label>
                  <Input
                    value={shippingMethod}
                    onChange={(e) => setShippingMethod(e.target.value)}
                    placeholder="e.g. Standard, Express"
                    className="bg-background"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Shipping Cost (EUR)</label>
                  <Input
                    type="number"
                    step="0.01"
                    value={shippingCost}
                    onChange={(e) => setShippingCost(parseFloat(e.target.value) || 0)}
                    className="bg-background"
                  />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Shipping Label</label>
                  <Input
                    value={shippingLabel}
                    onChange={(e) => setShippingLabel(e.target.value)}
                    placeholder="e.g. Standard Delivery"
                    className="bg-background"
                  />
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-card rounded-lg border border-border p-5 space-y-3">
                <h3 className="text-sm font-semibold text-foreground">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal:</span>
                    <span className="text-foreground">{subtotal.toFixed(2)} EUR</span>
                  </div>
                  {totalSavings > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount:</span>
                      <span>-{totalSavings.toFixed(2)} EUR</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping:</span>
                    <span className="text-foreground">{shippingCost.toFixed(2)} EUR</span>
                  </div>
                  <div className="border-t border-border pt-2 flex justify-between font-semibold">
                    <span>Total:</span>
                    <span>{totalAmount.toFixed(2)} EUR</span>
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading || cart.length === 0}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Creating...
                    </>
                  ) : (
                    "Create Order"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </main>
    </>
  );
};

export default CreateOrderPage;
