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
      name: 'message',
      title: 'Message',
      type: 'text',
      description: 'From contact form.',
    },
    {
      name: 'enquiryType',
      title: 'Enquiry type',
      type: 'string',
      description: 'From contact form.',
      options: {
        list: [
          { title: 'General', value: 'general' },
          { title: 'Order / Delivery', value: 'delivery' },
          { title: 'Returns', value: 'returns' },
          { title: 'Product support', value: 'support' },
          { title: 'Other', value: 'other' },
        ],
      },
    },
    {
      name: 'subscribed',
      title: 'Email marketing / Subscribed',
      type: 'boolean',
      description: 'Newsletter opt-in (newsletter signup, contact form, or order checkbox).',
    },
    {
      name: 'orderId',
      title: 'Order',
      type: 'reference',
      to: [{ type: 'order' }],
      description: 'Set when source is "order" to link to the order document.',
      hidden: ({ document }: { document?: { source?: string } }) => document?.source !== 'order',
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
