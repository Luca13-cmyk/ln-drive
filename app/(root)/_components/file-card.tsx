import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatRelative } from "date-fns";

import { useQuery } from "convex/react";

import Image from "next/image";
import { FileCardActions } from "./file-actions";
import { Doc } from "@/convex/_generated/dataModel";
import { api } from "@/convex/_generated/api";
import { Skeleton } from "@/components/ui/skeleton";
import { defaultNumItems } from "@/constants";
import { MotionDiv } from "@/components/shared/motion-div";
import { typeIcons, typeLargeIcons } from "@/components/shared/type-icons";

const variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export function FileCard({
  file,
  index,
}: {
  file: Doc<"files"> & { isFavorited: boolean };
  index: number;
}) {
  const userProfile = useQuery(api.users.getUserProfile, {
    userId: file.userId,
  });

  return (
    <MotionDiv
      variants={variants}
      initial="hidden"
      animate="visible"
      transition={{
        delay: index * 0.25,
        ease: "easeInOut",
        duration: 0.5,
      }}
      viewport={{ amount: 0 }}
    >
      <Card>
        <CardHeader className="relative">
          <CardTitle className="flex gap-2 text-base font-normal truncate">
            <div className="flex justify-center">{typeIcons[file.type]}</div>
            {file.name.substring(0, 12)}...
          </CardTitle>
          <div className="absolute top-2 right-2">
            <FileCardActions isFavorited={file.isFavorited} file={file} />
          </div>
        </CardHeader>
        <CardContent className="h-[250px] flex justify-center items-center">
          {file.type === "image" && (
            <div className="w-full h-[240px] relative">
              <Image
                alt={file.name}
                loading="lazy"
                className="h-52 w-full rounded-[10px] object-cover"
                sizes="(max-width: 767px) 100vw, (max-width: 1279px) 50vw, 33vw"
                fill
                src={file.fileId}
              />
            </div>
          )}

          {typeLargeIcons[file.type]}
        </CardContent>
        <CardFooter className="flex justify-between gap-4">
          <div className="flex gap-2 text-xs text-muted-foreground w-40 items-center">
            <Avatar className="w-6 h-6">
              <AvatarImage src={userProfile?.image} />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            {userProfile?.name}
          </div>
          <div className="text-xs text-muted-foreground">
            {formatRelative(new Date(file._creationTime), new Date())}
          </div>
        </CardFooter>
      </Card>
    </MotionDiv>
  );
}

export function SkeletonCard() {
  const skeletons = Array.from({ length: defaultNumItems }, (_, index) => {
    return (
      <div key={index} className="flex flex-col space-y-3">
        <Skeleton className="h-[300px] w-[250px] rounded-xl" />
        <div className="space-y-2">
          <Skeleton className="h-5 w-[250px]" />
          <Skeleton className="h-5 w-[200px]" />
        </div>
      </div>
    );
  });

  return skeletons;
}
