"use client";
import { api } from "@/convex/_generated/api";
import { useOrganization, useUser } from "@clerk/nextjs";
import { usePaginatedQuery, useQuery } from "convex/react";
import { FileCard, SkeletonCard } from "./file-card";
import Image from "next/image";

import UploadButton from "./upload-button";
import { useEffect, useState } from "react";

import { useInView } from "react-intersection-observer";
import {
  acceptedFiles,
  acceptedFilesFilter,
  defaultNumItems,
  initialNumItems,
  loadMoreItems,
  typesAcceptedFiles,
} from "@/constants";
import { DataTable, SkeletonTable } from "./file-table";
import { columns } from "./columns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GridIcon, Loader2, PlusCircle, Rows4Icon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Doc } from "@/convex/_generated/dataModel";

interface FileBrowserProps {
  title: string;
  favoritesOnly?: boolean;
  deletedOnly?: boolean;
}

const FileBrowser = ({
  title,
  favoritesOnly,
  deletedOnly,
}: FileBrowserProps) => {
  const [defaultValue, setDefaultValue] = useState<"grid" | "table">("grid");
  const [type, setType] = useState<Doc<"files">["type"] | "all">("all");

  const { organization, isLoaded: orgLoaded } = useOrganization();
  const { user, isLoaded } = useUser();

  const { ref, inView } = useInView();

  let orgId: string | undefined = undefined;
  if (orgLoaded && isLoaded) {
    orgId = organization?.id ?? user?.id;
  }

  const favorites = useQuery(
    api.files.getAllFavorites,
    orgId ? { orgId } : "skip"
  );

  const {
    results: files,
    status,
    loadMore,
  } = usePaginatedQuery(
    api.files.getFiles,
    orgId ? { orgId, deletedOnly } : "skip",
    {
      initialNumItems,
    }
  );

  const modifiedFiles =
    files
      ?.filter((file) => (type === "all" ? file : file.type === type))
      .map((file) => ({
        ...file,
        isFavorited: (favorites ?? []).some(
          (favorite) => favorite.fileId === file._id
        ),
      })) ?? [];

  useEffect(() => {
    if (inView && !!files && status === "CanLoadMore") {
      const promise = new Promise(() =>
        setTimeout(() => loadMore(loadMoreItems), 500)
      );
    }
  }, [inView, files, status]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const defaultTableValue = localStorage.getItem("defaultValueTable");
      if (defaultTableValue === "table") {
        setDefaultValue("table");
      } else {
        setDefaultValue("grid");
      }
    }
  }, [defaultValue]);

  if (status === "LoadingFirstPage") {
    return defaultValue === "grid" ? (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <SkeletonCard />
      </div>
    ) : (
      <SkeletonTable />
    );
  }

  if (files === null) {
    return <div>Not found</div>;
  }
  if (files && files.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[100vh] gap-8">
        <Image src="/empty.svg" alt="Empty" width="300" height="300" />
        <p className="text-muted-foreground text-2xl">
          You have no files, upload one now
        </p>
        <UploadButton />
      </div>
    );
  }
  let realIndex = 0;

  return (
    <>
      <Tabs
        defaultValue={defaultValue}
        onValueChange={(value) => {
          localStorage.setItem("defaultValueTable", value);
        }}
      >
        <div className="flex max-sm:flex-col max-sm:gap-y-4 justify-between items-center">
          <TabsList className="mb-2">
            <TabsTrigger value="grid" className="flex gap-2 items-center">
              <GridIcon />
              Grid
            </TabsTrigger>
            <TabsTrigger value="table" className="flex gap-2 items-center">
              <Rows4Icon />
              Tabela
            </TabsTrigger>
          </TabsList>
          <div className="flex gap-2 items-center ">
            <Label htmlFor="type-select ">Filtrar por</Label>
            <Select
              value={type}
              onValueChange={(newType) => {
                setType(newType as any);
              }}
            >
              <SelectTrigger id="type-select" className="w-[180px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {acceptedFilesFilter.map((acceptedFile, i) => (
                  <SelectItem key={`${acceptedFile}-${i}`} value={acceptedFile}>
                    {acceptedFile}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <TabsContent value="grid">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-24">
            {favoritesOnly
              ? modifiedFiles?.map((file, index) => {
                  return (
                    file.isFavorited && (
                      <FileCard key={file._id} index={index} file={file} />
                    )
                  );
                })
              : deletedOnly
              ? modifiedFiles?.map((file, index) => {
                  return (
                    file.shouldDelete && (
                      <FileCard key={file._id} index={index} file={file} />
                    )
                  );
                })
              : modifiedFiles?.map((file) => {
                  const index = realIndex % defaultNumItems;

                  realIndex++;
                  return <FileCard key={file._id} index={index} file={file} />;
                })}
            {status === "LoadingMore" && <SkeletonCard />}
          </div>
          {status === "CanLoadMore" && <div ref={ref} />}
        </TabsContent>
        <TabsContent value="table">
          <div className="flex flex-col gap-y-2 mb-4">
            <DataTable
              columns={columns}
              data={
                favoritesOnly
                  ? modifiedFiles
                      .filter((file) => file.isFavorited)
                      .map((file) => file)
                  : deletedOnly
                  ? modifiedFiles
                      .filter((file) => file.shouldDelete)
                      .map((file) => file)
                  : modifiedFiles
              }
            />
            <Button
              onClick={() => loadMore(defaultNumItems)}
              className="text-muted-foreground text-xs"
              variant="outline"
              size="sm"
              disabled={status === "Exhausted" || status === "LoadingMore"}
            >
              {status === "LoadingMore" ? (
                <>
                  <Loader2 className="animate-spin text-muted-foreground" />
                  <p>Loading...</p>
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4 mr-2" />
                  <p>Carregar +</p>
                </>
              )}
            </Button>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
};

export default FileBrowser;
