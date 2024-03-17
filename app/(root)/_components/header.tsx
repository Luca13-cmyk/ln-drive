"use client";
import MobileNav from "@/app/(root)/_components/mobile-nav";

import { useScrollTop } from "@/hooks/use-scroll-top";
import { cn } from "@/lib/utils";
import { OrganizationSwitcher, SignedIn, UserButton } from "@clerk/nextjs";

export function Header() {
  const scrolled = useScrollTop();
  return (
    <div
      className={cn(
        "relative top-0 left-0 right-0 z-10 border-b py-4 w-full h-[62px] bg-white transition-all ease-in-out duration-200",
        scrolled &&
          "backdrop-blur-sm bg-white/30 max-lg:sticky max-lg:top-0 max-lg:h-[65px] max-lg:rounded-lg max-lg:border-none"
      )}
    >
      <div className="flex items-center container mx-auto justify-between w-full">
        <div className="flex justify-between w-full">
          <SignedIn>
            <OrganizationSwitcher />

            <MobileNav />
            <div className="hidden xl:block">
              <UserButton showName afterSignOutUrl="/" />
            </div>
          </SignedIn>
        </div>
      </div>
    </div>
  );
}
