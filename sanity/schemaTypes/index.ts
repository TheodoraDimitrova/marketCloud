import { type SchemaTypeDefinition } from "sanity";
import category from "./category";
import product from "./product";
import adminAccess from "./adminAccess";

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [category, product, adminAccess],
};
