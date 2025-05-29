
import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  pages: {
    signIn: '/login', // This will be redirected to /[locale]/login by middleware
  },
  callbacks: {
    async session({ session, token }) {
      // Add userId to session
      if (token.sub && session.user) { // token.sub is usually the user's ID from the provider
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user, account }) {
      // Persist the OAuth access_token and or the user id to the token right after signin
      if (account && user) {
        // token.accessToken = account.access_token; // If you need access token
        if (user.id) token.userId = user.id; // Or account.providerAccountId
      }
      return token;
    }
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
};
