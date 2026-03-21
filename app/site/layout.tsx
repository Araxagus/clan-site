import OnlineList from "@/app/site/components/OnlineList";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-black text-white">

      {/* MAIN CONTENT */}
      <div className="flex-1">
        {children}
      </div>

      {/* SIDEBAR */}
      <OnlineList />

    </div>
  );
}