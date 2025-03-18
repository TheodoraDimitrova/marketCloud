import { type SchemaTypeDefinition } from 'sanity'
import category from './category'
import product from './product'
import order from "./order"
import cartItem from "./cartItem"

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [category, product, order , cartItem],
}
