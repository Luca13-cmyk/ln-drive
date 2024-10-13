"use client";

import { useEffect, useState } from "react";

import { UploadFilesModal } from "@/components/modals/upload-files-modal";
import PdfModal from "../modals/pdf-modal";

export const ModalProvider = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <>
      <UploadFilesModal />
      <PdfModal />
    </>
  );
};
