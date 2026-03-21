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
    // ✅ SIGN IN – tylko jednorazowa logika przy logowaniu
    async signIn({ user, account }) {
      if (account?.provider !== "discord") return true;

      if (!user?.email) return true;

      const discordId = account.providerAccountId;

      const dbUser = await prisma.user.findUnique({
        where: { email: user.email },
      });

      if (dbUser) {
        if (!dbUser.discordId) {
          await prisma.user.update({
            where: { id: dbUser.id },
            data: {
              discordId,
            },
          });
        }

        // 🔥 pierwszy user = admin
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

        // update online status
        await prisma.user.update({
          where: { id: dbUser.id },
          data: {
            lastSeen: new Date(),
            isOnline: true,
          },
        });
      }

      return true;
    },

    // ✅ JWT – tylko lekkie przypisanie danych (bez ciężkich query)
    async jwt({ token, user, account }) {
      // tylko przy pierwszym logowaniu
      if (account && user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (dbUser) {
          (token as any).id = dbUser.id;
          (token as any).role = dbUser.role;
          (token as any).isApproved = dbUser.isApproved;
          (token as any).discordId = dbUser.discordId;
        }
      }

      return token;
    },

    // ✅ SESSION – tylko mapowanie token → session (bez DB write!)
    async session({ session, token }: { session: Session; token: JWT }) {
      if (session.user) {
        (session.user as any).id = (token as any).id ?? null;
        (session.user as any).role = (token as any).role ?? null;
        (session.user as any).isApproved =
          (token as any).isApproved ?? false;
        (session.user as any).discordId =
          (token as any).discordId ?? null;
      }

      return session;
    },
  },

  pages: {
    signIn: "/site/login",
  },

  events: {
    // ✅ user created (pierwsze utworzenie przez adapter)
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

    // ⚠️ signOut – bez token (bezpieczniej)
    async signOut({ session }) {
      const userId = (session?.user as any)?.id;
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