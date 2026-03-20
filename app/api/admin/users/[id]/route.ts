import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: any) {
  const session = await getServerSession(authOptions);

  if (!session || (session.user as any).role !== "ADMIN") {
    return NextResponse.json({ error: "Brak dostępu" }, { status: 403 });
  }

  const { id } = params;
  const { action } = await req.json();

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

  try {
    switch (action) {
      case "approve":
        await prisma.user.update({
          where: { id },
          data: { isApproved: true, status: "active" },
        });
        break;

      case "reject":
        await prisma.user.delete({ where: { id } });
        break;

      case "promote":
        await prisma.user.update({
          where: { id },
          data: {
            role:
              user.role === "USER"
                ? "MOD"
                : user.role === "MOD"
                ? "ADMIN"
                : "ADMIN",
          },
        });
        break;

      case "demote":
        await prisma.user.update({
          where: { id },
          data: {
            role:
              user.role === "ADMIN"
                ? "MOD"
                : user.role === "MOD"
                ? "USER"
                : "USER",
          },
        });
        break;

      case "ban":
        await prisma.user.update({
          where: { id },
          data: { status: "banned" },
        });
        break;

      case "unban":
        await prisma.user.update({
          where: { id },
          data: { status: "active" },
        });
        break;

      case "delete":
        await prisma.user.delete({ where: { id } });
        break;

      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
