import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        // ⚠️ IMPORTANT: Replace this with your actual authentication logic
        // This is just a temporary example to make the build pass
        if (!credentials?.email || !credentials?.password) {
          return null;
        }
        
        // TODO: Add your database lookup here
        // For now, accept any credentials to test the build
        return {
          id: "1",
          email: credentials.email,
          name: "Test User"
        };
      }
    })
  ],
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  }
};

// ✅ The correct way for Next.js 15 App Router
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };