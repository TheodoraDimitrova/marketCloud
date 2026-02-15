/**
 * GROQ queries for orders. Public and admin.
 */

/** Single order by document id (public API) */
export const ORDER_BY_ID_QUERY = `*[_type == "order" && _id == $orderId][0]`;

/** Order numbers only (for generating next order number) */
export const ORDER_NUMBERS_QUERY = `*[_type == "order" && defined(orderNumber)].orderNumber`;

/** Admin: list of orders, newest first */
export const ADMIN_ORDERS_LIST_QUERY = `*[_type == "order"] | order(_createdAt desc) {
  _id,
  _createdAt,
  orderNumber,
  tracking,
  contact,
  firstName,
  lastName,
  address,
  postalCode,
  city,
  country,
  phone,
  paymentMethod,
  paymentStatus,
  totalAmount,
  status,
  cart[] { name, quantity, price, discountedPrice, subtotalSingleProduct }
}`;

/** Admin: single order full detail */
export const ADMIN_ORDER_DETAIL_QUERY = `*[_type == "order" && _id == $id][0] {
  _id,
  _createdAt,
  orderNumber,
  tracking,
  contact,
  firstName,
  lastName,
  address,
  postalCode,
  city,
  country,
  phone,
  paymentMethod,
  paymentStatus,
  totalAmount,
  subtotal,
  totalSavings,
  status,
  shipping,
  cart[] { name, quantity, price, discountedPrice, subtotalSingleProduct }
}`;

/** Admin: order status fields only (for PATCH) */
export const ADMIN_ORDER_STATUS_QUERY = `*[_type == "order" && _id == $id][0]{ _id, status, paymentStatus }`;
