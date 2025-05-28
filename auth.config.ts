import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      async authorize(credentials) {
        const { email, password } = credentials as any;

        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        const user = await prisma.user.findUnique({ where: { email } });

        if (!user) {
          throw new Error("Invalid Credentials");
        }

        if (!user.password) {
          throw new Error("Invalid Credentials");
        }

        // Ensure password is not null before calling bcrypt.compare
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) {
          throw new Error("Invalid password");
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
        token.picture = user.image;
        if ("role" in user) {
          token.role = user.role;
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string;
        session.user.image = token.picture as string;
        (session.user as any).role = token.role;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      if (url.startsWith(baseUrl)) {
        return url;
      }
      return baseUrl + "/"; // Replace '/dashboard' with your desired path
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
};

export default authConfig;
