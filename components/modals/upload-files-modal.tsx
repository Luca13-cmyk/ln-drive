"use client";

import {
  MultiFileDropzone,
  type FileState,
} from "@/components/shared/file-dropzone";
import { useEdgeStore } from "@/lib/edgestore";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { useUploadFiles } from "@/hooks/use-upload-files";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useOrganization, useUser } from "@clerk/nextjs";
import { toast } from "../ui/use-toast";
import { typesAcceptedFiles } from "@/constants";

export function UploadFilesModal() {
  const [fileStates, setFileStates] = useState<FileState[]>([]);
  const { edgestore } = useEdgeStore();
  const uploadFiles = useUploadFiles();
  const createFile = useMutation(api.files.createFile);
  const { organization, isLoaded: orgLoaded } = useOrganization();
  const user = useUser();

  function updateFileProgress(key: string, progress: FileState["progress"]) {
    setFileStates((fileStates) => {
      const newFileStates = structuredClone(fileStates);
      const fileState = newFileStates.find(
        (fileState) => fileState.key === key
      );
      if (fileState) {
        fileState.progress = progress;
      }
      return newFileStates;
    });
  }

  const onChange = async (files: FileState[]) => {
    setFileStates(files);
  };

  let orgId: string | undefined = undefined;
  if (orgLoaded && user.isLoaded) {
    orgId = organization?.id ?? user.user?.id;
  }

  return (
    <Dialog open={uploadFiles.isOpen} onOpenChange={uploadFiles.onClose}>
      <DialogContent className="flex flex-col items-center justify-center">
        <DialogHeader>
          <h2 className="text-center text-lg font-semibold">Files Uploader</h2>
        </DialogHeader>

        <MultiFileDropzone
          value={fileStates}
          onChange={onChange}
          onFilesAdded={async (addedFiles) => {
            setFileStates([...fileStates, ...addedFiles]);
            await Promise.all(
              addedFiles.map(async (addedFileState) => {
                try {
                  if (!orgId) return;

                  const res = await edgestore.publicFiles.upload({
                    file: addedFileState.file,
                    onProgressChange: async (progress) => {
                      updateFileProgress(addedFileState.key, progress);
                    },
                  });

                  const fileType = addedFileState.file.type;

                  await createFile({
                    name: addedFileState.file.name,
                    fileId: res.url,
                    orgId,
                    type: typesAcceptedFiles[fileType],
                  });
                  updateFileProgress(addedFileState.key, "COMPLETE");
                  toast({
                    variant: "success",
                    title: "File Uploaded",
                    description: "Now everyone can view your file",
                  });
                } catch (err) {
                  updateFileProgress(addedFileState.key, "ERROR");
                  toast({
                    variant: "destructive",
                    title: "Something went wrong",
                    description: `${err}`,
                  });
                }
              })
            );
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
