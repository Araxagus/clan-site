import { NextResponse } from "next/server";

export async function GET() {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const returnUrl = `${baseUrl}/api/steam/callback`;

  const steamOpenIdUrl =
    "https://steamcommunity.com/openid/login" +
    "?openid.ns=http://specs.openid.net/auth/2.0" +
    "&openid.mode=checkid_setup" +
    "&openid.return_to=" + encodeURIComponent(returnUrl) +
    "&openid.realm=" + encodeURIComponent(baseUrl) +
    "&openid.identity=http://specs.openid.net/auth/2.0/identifier_select" +
    "&openid.claimed_id=http://specs.openid.net/auth/2.0/identifier_select";

  return NextResponse.redirect(steamOpenIdUrl);
}
