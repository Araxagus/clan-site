import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request) {
  const base = process.env.NEXT_PUBLIC_URL!;
  const url = new URL(req.url);

  const claimedId = url.searchParams.get("openid.claimed_id");
  if (!claimedId) {
    return NextResponse.redirect(`${base}/?error=steam`);
  }

  const steamId = claimedId.split("/").pop();
  if (!steamId) {
    return NextResponse.redirect(`${base}/?error=steam`);
  }

  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.redirect(`${base}/?error=not_logged_in`);
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { steamId },
  });

  return NextResponse.redirect(`${base}/site/settings?steam=connected`);
}
