import { Rule } from "sanity";

const reviewSchema = {
  name: "review",
  title: "Review",
  type: "document",
  fields: [
    {
      name: "product",
      title: "Product",
      type: "reference",
      to: [{ type: "product" }],
      validation: (Rule: Rule) => Rule.required(),
    },
    {
      name: "author",
      title: "Author Name",
      type: "string",
      validation: (Rule: Rule) => Rule.required().min(2).max(100),
    },
    {
      name: "email",
      title: "Email",
      type: "string",
      validation: (Rule: Rule) => Rule.required().email(),
    },
    {
      name: "rating",
      title: "Rating",
      type: "number",
      validation: (Rule: Rule) => Rule.required().min(1).max(5),
    },
    {
      name: "comment",
      title: "Comment",
      type: "text",
      validation: (Rule: Rule) => Rule.required().min(10).max(1000),
    },
  ],
};

export default reviewSchema;
