/**
 * GROQ queries for products. Used by both root and admin.
 * Exclude draft documents so each product appears once.
 */

// All products (published only)
export const PRODUCTS_QUERY = `*[_type == "product" && !(_id in path("drafts.**"))]{
  ...,
  _createdAt,
  _updatedAt
}`;

// Products by category (published only)
export const PRODUCTS_BY_CATEGORY_QUERY = `*[_type == "product" && !(_id in path("drafts.**")) && references($categoryId)]`;

// Single product by slug (published only)
export const PRODUCT_BY_SLUG_QUERY = `*[_type == "product" && !(_id in path("drafts.**")) && slug.current == $slug][0]{
  ...,
  category->{
    _id,
    name,
    slug
  }
}`;

// Related products by category, excluding current (published only)
export const RELATED_PRODUCTS_QUERY = `*[_type == "product" && !(_id in path("drafts.**")) && references($categoryId) && _id != $currentProductId][0...4]{
  ...,
  _createdAt,
  _updatedAt
}`;
