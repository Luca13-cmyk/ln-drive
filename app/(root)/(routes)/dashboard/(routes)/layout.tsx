import { SearchBar } from "@/app/(root)/_components/search-bar";
import UploadButton from "@/app/(root)/_components/upload-button";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="w-full z-[3]">
        <div className="flex gap-x-2 justify-end items-center mb-8">
          <SearchBar />

          <UploadButton />
        </div>
        {children}
      </div>
    </>
  );
}
