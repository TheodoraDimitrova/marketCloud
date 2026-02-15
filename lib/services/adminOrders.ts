import type { AdminOrderDetail, AdminOrderListItem, SanityOrder } from "@/lib/types/adminOrder";

function mapPaymentStatus(order: SanityOrder): string {
  const s = order.paymentStatus ?? (order.status === "paid" ? "paid" : "unpaid");
  return s === "paid" ? "Paid" : "Unpaid";
}

function mapStatus(s: string | undefined): string {
  switch (s) {
    case "confirm":
      return "New";
    case "pending":
      return "Pending";
    case "fulfilled":
      return "Shipped";
    case "cancelled":
      return "Cancelled";
    default:
      return s || "New";
  }
}

function formatDate(createdAt: string | undefined): string {
  if (!createdAt) return "—";
  const d = new Date(createdAt);
  return d.toISOString().slice(0, 10);
}

export function sanityOrderToListItem(order: SanityOrder): AdminOrderListItem {
  const customer = [order.firstName, order.lastName].filter(Boolean).join(" ") || "—";
  return {
    id: order._id,
    orderNumber: order.orderNumber || order._id.slice(-8).toUpperCase(),
    date: formatDate(order._createdAt),
    createdAt: order._createdAt,
    customer,
    email: order.contact || "",
    phone: order.phone || "",
    total: order.totalAmount ?? 0,
    paymentStatus: mapPaymentStatus(order),
    fulfillmentStatus: mapStatus(order.status),
    paymentMethod: order.paymentMethod || "—",
    tracking: order.tracking,
  };
}

export function sanityOrderToDetail(order: SanityOrder): AdminOrderDetail {
  const list = sanityOrderToListItem(order);
  const items = (order.cart || []).map((item) => ({
    product: item.name || "—",
    variant: "",
    qty: item.quantity ?? 1,
    price: item.discountedPrice ?? item.price ?? 0,
  }));
  return {
    ...list,
    paymentMethod: order.paymentMethod || "—",
    shippingAddress: {
      address: order.address || "",
      city: order.city || "",
      zip: order.postalCode || "",
      country: order.country || "",
    },
    shipping: order.shipping
      ? {
          method: order.shipping.method ?? null,
          cost: order.shipping.cost,
          label: order.shipping.label,
        }
      : undefined,
    items,
    notes: [],
  };
}
