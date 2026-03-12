/**
 * GROQ queries for categories. Used by both root and admin.
 */

export const CATEGORIES_QUERY = `*[_type == "category"]{
  ...,
  "totalProducts": count(*[_type == "product" && references(^._id)])
}`;

/** Single category by slug */
export const CATEGORY_BY_SLUG_QUERY = `*[_type == "category" && slug.current == $slug][0]`;
