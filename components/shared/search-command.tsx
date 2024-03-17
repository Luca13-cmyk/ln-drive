"use client";

import { ReactNode, useEffect, useState } from "react";
import {
  FileTextIcon,
  GanttChartIcon,
  ImageIcon,
  MonitorPlay,
  TextQuote,
  Text,
} from "lucide-react";
import { useQuery } from "convex/react";
import { useRouter } from "next/navigation";
import { useUser } from "@clerk/clerk-react";
import Image from "next/image";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useSearch } from "@/hooks/use-search";
import { api } from "@/convex/_generated/api";
import { useOrganization } from "@clerk/nextjs";
import { FileCardActions } from "@/app/(root)/_components/file-actions";
import { Doc } from "@/convex/_generated/dataModel";
import { typeIcons } from "./type-icons";

export const SearchCommand = () => {
  const { isLoaded, user } = useUser();
  const { organization, isLoaded: orgLoaded } = useOrganization();
  const router = useRouter();

  let orgId: string | undefined = undefined;
  if (orgLoaded && isLoaded) {
    orgId = organization?.id ?? user?.id;
  }

  const files = useQuery(api.files.getSearch, orgId ? { orgId } : "skip");

  const favorites = useQuery(
    api.files.getAllFavorites,
    orgId ? { orgId } : "skip"
  );

  const [isMounted, setIsMounted] = useState(false);

  const toggle = useSearch((store) => store.toggle);
  const isOpen = useSearch((store) => store.isOpen);
  const onClose = useSearch((store) => store.onClose);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggle();
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [toggle]);

  const onSelect = (id: string) => {
    // router.push(`/file/${id}`);
    // onClose();
  };

  if (!isMounted) {
    return null;
  }

  const modifiedFiles =
    files?.map((file) => ({
      ...file,
      isFavorited: (favorites ?? []).some(
        (favorite) => favorite.fileId === file._id
      ),
    })) ?? [];

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput placeholder={`Search ${user?.fullName}'s DRIVE...`} />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>

        <CommandGroup heading="Files">
          {modifiedFiles?.map((file) => (
            <CommandItem
              key={file._id}
              value={`${file._id}-${file.name}`}
              title={file.name.substring(0, 8)}
              onSelect={() => onSelect(file._id)}
              className="gap-x-2 justify-between"
            >
              <div className="w-8 h-8">
                {typeIcons[file.type]}
                {file.type === "image" && (
                  <div>
                    <Image
                      src={file.fileId}
                      loading="lazy"
                      alt="Photo"
                      width="64"
                      height="64"
                      className="rounded-md bg-cover"
                    />
                  </div>
                )}
              </div>

              <span className="text-muted-foreground truncate">
                {file.name}
              </span>
              <FileCardActions file={file} isFavorited={file.isFavorited} />
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
};
