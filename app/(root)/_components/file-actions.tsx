"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Crop,
  Download,
  File,
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

import { usePdf } from "@/hooks/use-pdf";
import { useRouter } from "next/navigation";

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
  const router = useRouter();

  const pdfModal = usePdf();

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
          variant: "default",
          title: "Arquivo foi removido com sucesso!",
        });
      } else {
        toast({
          variant: "default",
          title: "Arquivo movido para lixeira",
          description: "Seu arquivo vai ser removido em breve",
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Tente de novo",
        description: "Erro ao mover para a lixeira",
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
            <AlertDialogTitle>Tem certeza?</AlertDialogTitle>
            <AlertDialogDescription>
              Essa ação irá mover seu arquivo a lixeira. A lixeira tem o
              processo de apagar arquivos automaticamente depois de um certo
              tempo.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              className="bg-yellow-600 hover:bg-yellow-500"
              disabled={isDeleting}
              onClick={() => handleDeleteFile({ deleteForever: false })}
            >
              Lixeira
            </AlertDialogAction>
            <AlertDialogAction
              className="bg-red-600 hover:bg-red-500"
              disabled={isDeleting}
              onClick={() => handleDeleteFile({ deleteForever: true })}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="animate-spin text-white" />
                  <p className="ml-2">Apagando...</p>
                </>
              ) : (
                <p>Apagar agora</p>
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
            <Download className="w-4 h-4" /> Download
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
                router.push(`/file/${file._id}`);
              }}
              className="flex gap-1 items-center cursor-pointer"
            >
              <File className="w-4 h-4" /> Abrir
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
                <StarIcon className="w-4 h-4" /> Desfavoritar
              </div>
            ) : (
              <div className="flex gap-1 items-center">
                <StarHalf className="w-4 h-4" /> Favoritar
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
                  <UndoIcon className="w-4 h-4" /> Restaurar
                </div>
              ) : (
                <div className="flex gap-1 text-red-600 items-center cursor-pointer">
                  <TrashIcon className="w-4 h-4" /> Lixeira
                </div>
              )}
            </DropdownMenuItem>
          </Protect>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
