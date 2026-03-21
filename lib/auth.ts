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
    async signIn({ account }) {
      // tylko Discord
      if (account?.provider === "discord") {
        const discordId = account.providerAccountId;

        // znajdź usera po email (NextAuth go tworzy)
        const user = await prisma.user.findFirst({
          where: { email: account.email! },
        });

        if (user) {
          // 🔥 zapis discordId jeśli go nie ma
          if (!user.discordId) {
            await prisma.user.update({
              where: { id: user.id },
              data: {
                discordId,
              },
            });
          }
        }
      }

      return true;
    },

    async jwt({ token, user, account }: any) {
      // 🔥 pierwszy login
      if (account?.provider === "discord") {
        const discordId = account.providerAccountId;
        (token as any).discordId = discordId;

        const dbUser = await prisma.user.findFirst({
          where: { email: user?.email || undefined },
        });

        if (dbUser) {
          // 🔥 jeśli brak discordId w DB → uzupełnij
          if (!dbUser.discordId) {
            await prisma.user.update({
              where: { id: dbUser.id },
              data: {
                discordId,
              },
            });
          }

          // 🔥 pierwszy admin
          const count = await prisma.user.count();
          const isFirstUser = count === 1;

          if (isFirstUser && dbUser.role !== "ADMIN") {
            await prisma.user.update({
              where: { id: dbUser.id },
              data: {
                role: "ADMIN",
                isApproved: true,
                status: "active",
              },
            });
          }

          await prisma.user.update({
            where: { id: dbUser.id },
            data: {
              lastSeen: new Date(),
              isOnline: true,
            },
          });

          (token as any).id = dbUser.id;
          (token as any).role = dbUser.role;
          (token as any).isApproved = dbUser.isApproved;
        }
      }

      return token;
    },

    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        const userId = (token as any).id;

        (session.user as any).id = userId ?? null;
        (session.user as any).role = (token as any).role ?? null;
        (session.user as any).isApproved =
          (token as any).isApproved ?? false;

        if (userId) {
          await prisma.user.update({
            where: { id: userId },
            data: {
              lastSeen: new Date(),
              isOnline: true,
            },
          });
        }
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
          lastSeen: new Date(),
          isOnline: true,
        },
      });
    },

    async signOut({ token }) {
      const userId = (token as any)?.id;
      if (!userId) return;

      await prisma.user.update({
        where: { id: userId },
        data: {
          isOnline: false,
        },
      });
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };