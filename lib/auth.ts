import NextAuth, { type NextAuthOptions } from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import type { JWT } from "next-auth/jwt";
import type { Session, User } from "next-auth";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    DiscordProvider({
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
    strategy: "jwt",
  },

  callbacks: {
    async signIn() {
      return true;
    },

    async jwt({ token, user }: { token: JWT; user?: User }) {
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

          (token as any).id = dbUser.id;
          (token as any).role = dbUser.role;
          (token as any).isApproved = dbUser.isApproved;
        }
      }

      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        (session.user as any).id = (token as any).id ?? null;
        (session.user as any).role = (token as any).role ?? null;
        (session.user as any).isApproved = (token as any).isApproved ?? false;
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
