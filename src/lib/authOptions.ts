
import type { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    // Add other providers here, e.g., Telegram, if you configure them later
  ],
  pages: {
    signIn: '/login',
    // signOut: '/auth/signout', // Default
    // error: '/auth/error', // Default
    // verifyRequest: '/auth/verify-request', // Default
    // newUser: null // If you want to redirect new users to a specific page
  },
  callbacks: {
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token and user id from a provider.
      // You can add custom properties to the session object here.
      // For example, if you store user roles or other info in the token during JWT callback.
      // session.accessToken = token.accessToken; // Example
      // session.user.id = token.id; // Example
      return session;
    },
    // async jwt({ token, user, account, profile, isNewUser }) {
    //   // Persist the OAuth access_token and or the user id to the token right after signin
    //   if (account && user) {
    //     token.accessToken = account.access_token; // Example
    //     token.id = user.id; // Example
    //   }
    //   return token;
    // }
  },
  // Enable debug messages in the console if you are having problems
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
};
