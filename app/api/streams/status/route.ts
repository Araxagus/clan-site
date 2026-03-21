import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { streams } = await req.json();

  const results = await Promise.all(
    streams.map(async (s: any) => {
      if (s.platform !== "twitch") {
        return { ...s, isLive: true };
      }

      const channel = s.url.replace(/https?:\/\/(www\.)?twitch\.tv\//, "");

      try {
        const res = await fetch(
          `https://decapi.me/twitch/uptime/${channel}`
        );

        const text = await res.text();

        const isLive = !text.includes("offline");

        return { ...s, isLive };
      } catch {
        return { ...s, isLive: false };
      }
    })
  );

  return NextResponse.json(results);
}