export const calculateDiscountedPrice = (product) => {
  if (!product.discount?.isActive) return product.price * product.quantity;

  let discountedPrice = product.price;
  if (product.discount.type === "percentage") {
    discountedPrice =
      product.price - (product.price * product.discount.amount) / 100;
  } else if (product.discount.type === "fixed") {
    discountedPrice = Math.max(product.price - product.discount.amount, 0);
  }

  return discountedPrice * product.quantity;
};

export const calculateTotalSavings = (cartItems) => {
  return cartItems.reduce((sum, item) => {
    const originalPrice = item.price * item.quantity;
    const discountedPrice = calculateDiscountedPrice(item);

    // Спестената сума
    return sum + (originalPrice - discountedPrice);
  }, 0);
};

export const calculateSubtotal = (cartItems) => {
  return cartItems.reduce(
    (sum, item) => sum + calculateDiscountedPrice(item),
    0
  );
};

export const calculateShippingFee = (deliveryMethod, subtotal) => {
  if (subtotal >= 60) {
    return "Free";
  }
  if (deliveryMethod === "toAddress") {
    return 5;
  } else if (deliveryMethod === "toCourierOffice") {
    return 4;
  } else if (deliveryMethod === "toSmartPoint") {
    return 3;
  }
  return 0;
};
