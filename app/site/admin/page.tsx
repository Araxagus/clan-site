import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import AdminPanelClient from "@/app/site/admin/AdminPanelClient";

export default async function Page() {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <p className="text-xl opacity-80">Brak dostępu.</p>
      </div>
    );
  }

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
  });

  const games = await prisma.game.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <AdminPanelClient
      users={JSON.parse(JSON.stringify(users))}
      games={JSON.parse(JSON.stringify(games))}
      userId={session.user.id}
    />
  );
}
