"use client";

import OnlineList from "@/app/site/components/OnlineList";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <div className="flex min-h-screen bg-black text-white">

      {/* MAIN CONTENT */}
      <div className="flex-1 relative">

        {/* POWRÓT — widoczny na każdej stronie poza homepage */}
        {!isHome && (
          <Link
            href="/"
            className="
              absolute top-4 left-4 z-20
              px-4 py-2
              bg-white/10 hover:bg-white/20
              border border-white/20
              rounded
              text-sm font-semibold
              transition
            "
          >
            ← POWRÓT
          </Link>
        )}

        {children}
      </div>

      {/* SIDEBAR */}
      <OnlineList />
    </div>
  );
}
