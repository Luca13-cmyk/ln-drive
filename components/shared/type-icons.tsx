import { Doc } from "@/convex/_generated/dataModel";
import {
  FileTextIcon,
  GanttChartIcon,
  MonitorPlay,
  TextQuote,
  Text,
} from "lucide-react";
import { ReactNode } from "react";

export const typeIcons = {
  pdf: <FileTextIcon />,
  csv: <GanttChartIcon />,
  text: <Text />,
  xlsx: <TextQuote />,
  video: <MonitorPlay />,
  docx: <TextQuote />,
} as Record<Doc<"files">["type"], ReactNode>;

export const typeLargeIcons = {
  pdf: <FileTextIcon className="h-20 w-20" />,

  csv: <GanttChartIcon className="h-20 w-20" />,
  text: <Text className="h-20 w-20" />,
  xlsx: <TextQuote className="h-20 w-20" />,
  video: <MonitorPlay className="h-20 w-20" />,
  docx: <TextQuote className="h-20 w-20" />,
} as Record<Doc<"files">["type"], ReactNode>;
