import NextAuth from "next-auth";
import Google from "next-auth/providers/google";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async jwt({ token, profile }) {
      // On first login, profile comes from Google and contains picture
      if (profile && (profile as any).picture) {
        (token as any).picture = (profile as any).picture;
      }
      return token;
    },
    async session({ session, token }) {
      // Ensure session.user.image is set from token.picture (if available)
      if (session.user) {
        const picture = (token as any).picture as string | undefined;
        if (picture) {
          session.user.image = picture;
        }
      }
      return session;
    },
  },
  pages: {
    signIn: "/admin/login",
  },
  trustHost: true,
});
