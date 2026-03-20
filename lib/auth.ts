import NextAuth from "next-auth";
import Discord from "next-auth/providers/discord";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import type { JWT } from "next-auth/jwt";
import type { Session, User } from "next-auth";

export const authOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    Discord({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
      authorization: {
        params: {
          scope: "identify email",
        },
      },
    }),
  ],

  session: {
    strategy: "jwt" as const,
  },

  callbacks: {
    async signIn() {
      return true;
    },

    async jwt({
      token,
      user,
    }: {
      token: JWT;
      user?: User;
    }) {
      if (user?.email) {
        let dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (dbUser) {
          const count = await prisma.user.count();
          const isFirstUser = count === 1;

          if (isFirstUser && dbUser.role !== "ADMIN") {
            dbUser = await prisma.user.update({
              where: { id: dbUser.id },
              data: {
                role: "ADMIN",
                isApproved: true,
                status: "active",
              },
            });
          }

          token.id = dbUser.id;
          token.role = dbUser.role;
          token.isApproved = dbUser.isApproved;
        }
      }

      return token;
    },

    async session({
      session,
      token,
    }: {
      session: Session;
      token: JWT;
    }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
        session.user.isApproved = token.isApproved as boolean;
      }

      return session;
    },
  },

  pages: {
    signIn: "/site/login",
  },

  events: {
    async createUser({ user }: { user: User }) {
      if (!user.email) return;

      await prisma.user.update({
        where: { email: user.email },
        data: {
          role: "USER",
          isApproved: false,
          status: "pending",
        },
      });
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
