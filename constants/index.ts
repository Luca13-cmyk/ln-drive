import { Doc } from "@/convex/_generated/dataModel";

export const navLinks = [
  {
    label: "Home",
    route: "/dashboard/files",
    icon: "/assets/icons/home.svg",
  },

  {
    label: "Favoritos",
    route: "/dashboard/favorites",
    icon: "/assets/icons/stars.svg",
  },
  {
    label: "Lixeira",
    route: "/dashboard/trash",
    icon: "/assets/icons/scan.svg",
  },
  // {
  //   label: "Profile",
  //   route: "/dashboard/profile",
  //   icon: "/assets/icons/profile.svg",
  // },
];

// To change the accepted files, change here -> schema.ts -> type-icons.tsx
export const acceptedFiles = [
  "image/jpeg",
  "image/png",
  "image/jpg",
  "image/*",
  "application/pdf",
  "text/csv",
  "text/plain",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "video/mp4",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
];
export const acceptedFilesFilter = [
  "image",
  "csv",
  "pdf",
  "text",
  "xlsx",
  "video",
  "docx",
];

export const typesAcceptedFiles = {
  "image/jpeg": "image",
  "image/png": "image",
  "image/jpg": "image",
  "application/pdf": "pdf",
  "text/csv": "csv",
  "text/plain": "text",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "xlsx",
  "video/mp4": "video",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
} as Record<string, Doc<"files">["type"]>;

export const defaultNumItems = 9;
export const loadMoreItems = defaultNumItems;
export const initialNumItems = defaultNumItems;
