/**
 * GROQ queries for reviews.
 */

export const REVIEWS_BY_PRODUCT_QUERY = `*[_type == "review" && product._ref == $productId] | order(_createdAt desc){
  _id,
  author,
  rating,
  comment,
  product,
  _createdAt,
  _updatedAt
}`;
