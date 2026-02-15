import { type SchemaTypeDefinition } from 'sanity'
import category from './category'
import product from './product'
import order from "./order"
import cartItem from "./cartItem"
import review from "./review"
import adminAccess from './adminAccess'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [category, product, order, cartItem, review, adminAccess],
}
