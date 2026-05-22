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
        // Your authentication logic here
        // Return user object if valid, null if not
        
        if (credentials?.email === "user@example.com" && credentials?.password === "password") {
          return { id: "1", name: "User", email: credentials.email };
        }
        return null;
      }
    })
  ],
  pages: {
    signIn: "/auth/signin",  // optional custom signin page
  },
  session: {
    strategy: "jwt",  // important for credentials provider
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
      }
      return session;
    }
  }
};

export default NextAuth(authOptions);