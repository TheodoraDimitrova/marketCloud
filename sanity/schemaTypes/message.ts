/**
 * Contact form message - separate document like reviews
 */
const messageSchema = {
  name: 'message',
  title: 'Contact Message',
  type: 'document',
  fields: [
    {
      name: 'contact',
      title: 'Contact',
      type: 'reference',
      to: [{ type: 'contact' }],
      validation: (Rule: { required: () => unknown }) => Rule.required(),
      description: 'The contact who sent this message.',
    },
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      description: 'Name from the contact form.',
    },
    {
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule: { required: () => unknown }) => Rule.required().email(),
      description: 'Email from the contact form.',
    },
    {
      name: 'message',
      title: 'Message',
      type: 'text',
      validation: (Rule: { required: () => unknown }) => Rule.required(),
      description: 'The message content.',
    },
    {
      name: 'enquiryType',
      title: 'Enquiry type',
      type: 'string',
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
      name: 'orderNumber',
      title: 'Order number',
      type: 'string',
      description: 'Order number mentioned in this message (if any).',
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Read', value: 'read' },
          { title: 'Replied', value: 'replied' },
          { title: 'Closed', value: 'closed' },
        ],
        layout: 'radio',
      },
      initialValue: 'new',
    },
    {
      name: 'adminReply',
      title: 'Admin reply',
      type: 'text',
      description: 'Reply/notes from admin.',
    },
    {
      name: 'repliedAt',
      title: 'Replied at',
      type: 'datetime',
      description: 'When admin replied to this message.',
    },
  ],
  orderings: [
    { title: 'Newest first', name: 'createdAtDesc', by: [{ field: '_createdAt', direction: 'desc' }] },
    { title: 'Oldest first', name: 'createdAtAsc', by: [{ field: '_createdAt', direction: 'asc' }] },
  ],
  preview: {
    select: {
      name: 'name',
      email: 'email',
      message: 'message',
      status: 'status',
      createdAt: '_createdAt',
    },
    prepare({ name, email, message, status, createdAt }: { name?: string; email?: string; message?: string; status?: string; createdAt?: string }) {
      const title = name || email || 'Unknown'
      const preview = message ? (message.length > 50 ? message.substring(0, 50) + '...' : message) : 'No message'
      const date = createdAt ? new Date(createdAt).toLocaleDateString() : ''
      return {
        title: `${title} - ${status || 'new'}`,
        subtitle: `${preview} • ${date}`,
      }
    },
  },
}

export default messageSchema
