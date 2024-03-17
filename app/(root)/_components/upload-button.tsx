"use client";
import { Button } from "@/components/ui/button";
import { useUploadFiles } from "@/hooks/use-upload-files";
import { UploadCloudIcon } from "lucide-react";
import React from "react";

const UploadButton = () => {
  const uploadModal = useUploadFiles();
  return (
    <Button
      onClick={uploadModal.onOpen}
      className="text-muted-foreground text-xs"
      variant="outline"
      size="sm"
    >
      <UploadCloudIcon className="h-4 w-4 mr-2" />
      Add files
    </Button>
  );
};

export default UploadButton;
