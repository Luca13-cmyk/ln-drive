"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  BrainCircuit,
  Crop,
  FileIcon,
  Loader2,
  MoreVertical,
  StarHalf,
  StarIcon,
  TrashIcon,
  UndoIcon,
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useMutation, useQuery } from "convex/react";

import { useToast } from "@/components/ui/use-toast";
import { Protect } from "@clerk/nextjs";
import { api } from "@/convex/_generated/api";
import { Doc } from "@/convex/_generated/dataModel";
import { useEdgeStore } from "@/lib/edgestore";

export function FileCardActions({
  file,
  isFavorited,
}: {
  file: Doc<"files">;
  isFavorited: boolean;
}) {
  const deleteFile = useMutation(api.files.deleteFile);
  const restoreFile = useMutation(api.files.restoreFile);
  const toggleFavorite = useMutation(api.files.toggleFavorite);
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const me = useQuery(api.users.getMe);
  const { edgestore } = useEdgeStore();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const handleDeleteFile = async ({
    deleteForever,
  }: {
    deleteForever?: boolean;
  }) => {
    setIsDeleting(true);
    try {
      if (deleteForever) {
        await edgestore.publicFiles.delete({
          url: file.fileId,
        });
      }

      await deleteFile({
        fileId: file._id,
        deleteForever,
      });
      if (deleteForever) {
        toast({
          variant: "destructive",
          title: "File was removed successfully!",
        });
      } else {
        toast({
          variant: "default",
          title: "File marked for deletion",
          description: "Your file will be deleted soon",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Try again",
        description: "Failed to move to trash",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <AlertDialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will mark the file for our deletion process. Files are
              deleted periodically
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-yellow-600 hover:bg-yellow-500"
              disabled={isDeleting}
              onClick={() => handleDeleteFile({ deleteForever: false })}
            >
              Trash
            </AlertDialogAction>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-500"
              disabled={isDeleting}
              onClick={() => handleDeleteFile({ deleteForever: true })}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="animate-spin text-white" />
                  <p className="ml-2">Deleting...</p>
                </>
              ) : (
                <p>Delete now</p>
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <DropdownMenu>
        <DropdownMenuTrigger>
          <MoreVertical />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => {
              window.open(file.fileId, "_blank");
            }}
            className="flex gap-1 items-center cursor-pointer"
          >
            <FileIcon className="w-4 h-4" /> Download
          </DropdownMenuItem>
          {file.type === "image" && (
            <DropdownMenuItem
              onClick={() => {
                window.open("https://ln-imaginify.vercel.app", "_blank");
              }}
              className="flex gap-1 items-center cursor-pointer"
            >
              <Crop className="w-4 h-4" /> Imaginify
            </DropdownMenuItem>
          )}
          {file.type === "pdf" && (
            <DropdownMenuItem
              onClick={() => {
                window.open("https://quill-hazel.vercel.app", "_blank");
              }}
              className="flex gap-1 items-center cursor-pointer"
            >
              <BrainCircuit className="w-4 h-4" /> Quill
            </DropdownMenuItem>
          )}

          <DropdownMenuItem
            onClick={() => {
              console.log("favorite");
              toggleFavorite({
                fileId: file._id,
              });
            }}
            className="flex gap-1 items-center cursor-pointer"
          >
            {isFavorited ? (
              <div className="flex gap-1 items-center">
                <StarIcon className="w-4 h-4" /> Unfavorite
              </div>
            ) : (
              <div className="flex gap-1 items-center">
                <StarHalf className="w-4 h-4" /> Favorite
              </div>
            )}
          </DropdownMenuItem>

          <Protect
            condition={(check) => {
              return (
                check({
                  role: "org:admin",
                }) || file.userId === me?._id
              );
            }}
            fallback={<></>}
          >
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                if (file.shouldDelete) {
                  restoreFile({
                    fileId: file._id,
                  });
                } else {
                  setIsConfirmOpen(true);
                }
              }}
              className="flex gap-1 items-center cursor-pointer"
            >
              {file.shouldDelete ? (
                <div className="flex gap-1 text-green-600 items-center cursor-pointer">
                  <UndoIcon className="w-4 h-4" /> Restore
                </div>
              ) : (
                <div className="flex gap-1 text-red-600 items-center cursor-pointer">
                  <TrashIcon className="w-4 h-4" /> Delete
                </div>
              )}
            </DropdownMenuItem>
          </Protect>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
