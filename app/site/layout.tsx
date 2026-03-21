"use client";

import OnlineList from "@/app/site/components/OnlineList";
import { usePathname, useRouter } from "next/navigation";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();

  // tu definiujemy, co jest homepage
  const isHome = pathname === "/site/homepage";

  return (
    <div className="flex min-h-screen bg-black text-white">

      {/* MAIN CONTENT */}
      <div className="flex-1 relative">

        {/* POWRÓT — widoczny na każdej stronie poza homepage */}
        {!isHome && (
          <button
            onClick={() => router.back()}
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
          </button>
        )}

        {children}
      </div>

      {/* SIDEBAR */}
      <OnlineList />
    </div>
  );
}
