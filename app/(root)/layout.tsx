import { SearchCommand } from "@/components/shared/search-command";
import SideNav from "./_components/side-nav";
import { Header } from "./_components/header";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Dashboard",
};
export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <Header />
      <main className="container mx-auto pt-12 min-h-screen">
        <div className="flex gap-8">
          <SideNav />
          <div className="h-[100vh] w-[100vw] flex fixed justify-center p-4 z-0">
            <div className="gradient" />
          </div>

          <SearchCommand />
          <div className="w-full z-[3]">{children}</div>
        </div>
      </main>
    </>
  );
}
