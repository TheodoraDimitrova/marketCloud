import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    defineField({
      name: 'id',
      title: 'Category ID',
      type: 'string',
      description: 'Unique identifier for the category',
    }),
    defineField({
      name: 'name',
      title: 'Category Name',
      type: 'string',
      description: 'The name of the category',
    }),
    defineField({
      name: 'description',
      title: 'Description',
      type: 'text',
      description: 'Description of the category',
    }),
    defineField({
      name: 'image',
      title: 'Category Image',
      type: 'image',
      options: {
        hotspot: true, 
      },
      description: 'Image representing the category',
    }),
  ],
})
