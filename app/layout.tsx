import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ConvexClientProvider } from "@/components/providers/convex-provider";

import { EdgeStoreProvider } from "@/lib/edgestore";
import { ModalProvider } from "@/components/providers/modal-provider";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "LN DRIVE",
  description:
    "The easiest way to upload and share files with your company. Make an account and start managing your files in less than a minute.",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["ln drive", "ln-drive"],
  icons: {
    icon: [
      {
        media: "(prefers-color-scheme: light)",
        url: "/logo.png",
        href: "/logo.png",
      },
      {
        media: "(prefers-color-scheme: dark)",
        url: "/logo.png",
        href: "/logo.png",
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <EdgeStoreProvider>
          <ConvexClientProvider>
            <ModalProvider />
            <Toaster />
            {children}
          </ConvexClientProvider>
        </EdgeStoreProvider>
      </body>
    </html>
  );
}
