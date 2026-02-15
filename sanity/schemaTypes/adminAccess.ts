import { defineType, defineField } from 'sanity'

/**
 * Singleton: list of email addresses that are allowed to access the admin panel.
 * Only these users (after signing in with Google) can open /admin.
 */
export default defineType({
  name: 'adminAccess',
  title: 'Admin access',
  type: 'document',
  __experimental_omnisearch_visibility: false,
  fields: [
    defineField({
      name: 'emails',
      title: 'Allowed admin emails',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Google account emails that can sign in to the admin panel (one or two people).',
      validation: (Rule) =>
        Rule.custom((emails: unknown) => {
          if (!Array.isArray(emails)) return true
          const invalid = emails.some((e) => typeof e !== 'string' || !e.includes('@'))
          return invalid ? 'Each item must be a valid email address' : true
        }),
    }),
  ],
  preview: {
    select: { emails: 'emails' },
    prepare({ emails }: { emails?: string[] }) {
      const count = Array.isArray(emails) ? emails.length : 0
      return { title: 'Admin access', subtitle: `${count} email(s) allowed` }
    },
  },
})
