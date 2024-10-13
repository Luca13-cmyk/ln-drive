"use client";
import PdfRenderer from "@/components/PDF/pdf-renderer";
import { Spinner } from "@/components/ui/spinner";
import { api } from "@/convex/_generated/api";
import { Id } from "@/convex/_generated/dataModel";
import { useQuery } from "convex/react";
import React from "react";

interface PageProps {
  params: {
    id: Id<"files">;
  };
}

const Page = ({ params }: PageProps) => {
  const file = useQuery(api.files.getFileId, {
    fileId: params.id,
  });

  if (file === undefined) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  if (file === null) {
    return <div>Not found</div>;
  }

  return (
    <div className="justify-between flex flex-col h-[calc(100vh-3.5rem)]">
      <div className="mx-auto w-full max-w-8xl grow lg:flex xl:px-2">
        {/* Left sidebar & main wrapper */}
        <div className="flex-1 xl:flex">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            {/* Main area */}
            <PdfRenderer url={file.fileId} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Page;
