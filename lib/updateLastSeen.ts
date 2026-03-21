import { prisma } from "@/lib/prisma";

export async function updateLastSeen(userId: string) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        lastSeen: new Date(),
      },
    });
  } catch (e) {
    console.warn("Failed to update lastSeen");
  }
}