"use client";
import { navLinks } from "@/constants";
import { SignedIn, UserButton } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const BottomNav = () => {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 w-full flex gap-2 z-20 xl:hidden">
      <SignedIn>
        <ul className="header-bottom_nav_elements">
          <UserButton afterSignOutUrl="/" />
          {navLinks.map((link) => {
            const isActive = link.route === pathname;

            return (
              <li
                className={`${
                  isActive && "gradient-text"
                } p-18 flex whitespace-nowrap text-dark-700`}
                key={link.route}
              >
                <Link className="sidebar-link cursor-pointer" href={link.route}>
                  <Image src={link.icon} alt="logo" width={24} height={24} />
                </Link>
              </li>
            );
          })}
        </ul>
      </SignedIn>
    </nav>
  );
};

export default BottomNav;
