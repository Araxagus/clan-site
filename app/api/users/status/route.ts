import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function mapStatus(status: string) {
  switch (status) {
    case "online":
      return { label: "Online", color: "bg-green-500" };
    case "idle":
      return { label: "Idle", color: "bg-yellow-500" };
    case "dnd":
      return { label: "Nie przeszkadzać", color: "bg-red-500" };
    default:
      return { label: "Offline", color: "bg-gray-500" };
  }
}

export async function GET() {
  try {
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        discordId: true,
        discordStatus: true,
        discordActivity: true,
        discordActivityStart: true,
      },
    });

    const formatted = users.map((u) => {
      const status = u.discordStatus || "offline";
      const statusMeta = mapStatus(status);

      return {
        id: u.id,
        name: u.name,

        discordStatus: status,
        discordActivity: u.discordActivity,

        statusMeta, // zawsze istnieje

        isOnline: status !== "offline",

        activityStart: u.discordActivityStart,
      };
    });

    return NextResponse.json(formatted);
  } catch (e) {
    console.error(e);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}