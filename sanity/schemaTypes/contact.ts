/**
 * Unified contact/lead from any channel: newsletter, contact form, or order.
 * One document per submission; optional fields depending on source.
 */
const contactSchema = {
  name: 'contact',
  title: 'Contact / Lead',
  type: 'document',
  fields: [
    {
      name: 'source',
      title: 'Source',
      type: 'string',
      options: {
        list: [
          { title: 'Newsletter', value: 'newsletter' },
          { title: 'Contact form', value: 'contact' },
          { title: 'Order', value: 'order' },
        ],
        layout: 'radio',
      },
      validation: (Rule: { required: () => unknown }) => Rule.required(),
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule: { required: () => unknown }) => Rule.required().email(),
    },
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'From contact form or order.',
    },
    {
      name: 'messages',
      title: 'Messages',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'message' }] }],
      description: 'All messages from this contact (can have multiple).',
    },
    {
      name: 'subscribed',
      title: 'Email marketing / Subscribed',
      type: 'boolean',
      description: 'Newsletter opt-in (newsletter signup, contact form, or order checkbox).',
    },
    {
      name: 'orders',
      title: 'Orders',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'order' }] }],
      description: 'All orders from this contact (can have multiple).',
    },
    {
      name: 'reviews',
      title: 'Reviews',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'review' }] }],
      description: 'All reviews from this contact (can have multiple).',
    },
  ],
  orderings: [
    { title: 'Newest first', name: 'createdAtDesc', by: [{ field: '_createdAt', direction: 'desc' }] },
  ],
  preview: {
    select: { source: 'source', email: 'email', name: 'name' },
    prepare({ source, email, name }: { source?: string; email?: string; name?: string }) {
      const label = source ? `${source}` : 'Contact'
      const sub = name ? `${name} · ${email}` : email
      return { title: label, subtitle: sub || '—' }
    },
  },
}

export default contactSchema
