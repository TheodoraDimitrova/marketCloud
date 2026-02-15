/**
 * GROQ queries for categories. Used by both root and admin.
 */

export const CATEGORIES_QUERY = `*[_type == "category"]{
  ...,
  "totalProducts": count(*[_type == "product" && references(^._id)])
}`;

/** Single category by slug */
export const CATEGORY_BY_SLUG_QUERY = `*[_type == "category" && slug.current == $slug][0]`;

/** Categories by document ids (admin: expand refs). Excludes drafts. */
export const CATEGORIES_BY_IDS_QUERY = `*[_id in $ids && !(_id in path("drafts.**"))] {
  _id,
  name
}`;
