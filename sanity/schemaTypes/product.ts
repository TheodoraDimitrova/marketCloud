import { Rule } from 'sanity';

const productSchema = {
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    {
      name: "name",
      title: "Product Name",
      type: "string",
    },
    {
      "name": "slug",
      "type": "slug",
      "title": "Slug",
      "description": "unique identifier for the product url",
    },
    {
      name: "description",
      title: "Description",
      type: "text",
    },
    {
        name: "productDetails",
        title: "Product Details",
        type: "array",
        of: [{ type: "string" }]
       
      },
    {
      name: "price",
      title: "Price",
      type: "number",
    },
    {
        name: "images",  
        title: "Product Images",
        type: "array",
        of: [{ type: "image" }],
        options: {
          hotspot: true,  
        },
      },
    {
      name: "quantity",
      title: "Quantity",
      type: "number",
    },
    {
      name: "package",
      title: "Package",
      type: "string",
    },
    {
      name: "sizes",
      title: "Sizes",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "colors",
      title: "Colors",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "rating",
      title: "Rating",
      type: "number",
      validation: (Rule: Rule) => Rule.min(0).max(5),  // Използвай правилния тип за Rule
    },
    {
      name: "reviews",
      title: "Number of Reviews",
      type: "number",
    },
    {
      name: "category",
      title: "Category",
      type: "string",
    },
    {
      name: "brand",
      title: "Brand",
      type: "string",
    },
    {
      name: "sku",
      title: "SKU",
      type: "string",
    },
    {
      name: "stock",
      title: "Stock",
      type: "number",
    },
    {
      name: "tags",
      title: "Tags",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            {
              name: "type",
              title: "Type",
              type: "string",
            },
            {
              name: "label",
              title: "Label",
              type: "string",
            },
          ],
        },
      ],
    },
    {
      name: "discount",
      title: "Discount",
      type: "object",
      fields: [
        {
          name: "amount",
          title: "Discount Amount",
          type: "number",
        },
        {
          name: "type",
          title: "Discount Type",
          type: "string",
          options: {
            list: [
              { title: "Percentage", value: "percentage" },
              { title: "Fixed", value: "fixed" },
            ],
            layout: "radio",
          },
        },
        {
          name: "isActive",
          title: "Is Active",
          type: "boolean",
        },
      ],
    },
  ],
};

export default productSchema;
