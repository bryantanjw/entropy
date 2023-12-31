"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import {
  ArrowRightIcon,
  CameraIcon,
  Cross2Icon,
  ExitIcon,
  HamburgerMenuIcon,
  MoonIcon,
  PersonIcon,
  RocketIcon,
  SunIcon,
} from "@radix-ui/react-icons";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { UserNav } from "./user-nav";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { ModeToggle } from "./ui/theme-toggle";

export default function Navbar() {
  const router = useRouter();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <div>
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-6 lg:px-8 sm:flex-row h-14 backdrop-blur-md border-b border-b-slate-500 border-opacity-20 bg-transparent darktext-white"
        )}
      >
        <Link href={"/"} className="text-lg font-semibold">
          Entropy
        </Link>
        <div className="ml-auto flex space-x-3 sm:justify items-center">
          <Button
            variant="ghost"
            onClick={() => setIsMenuOpen((prev) => !prev)}
            className={cn("md:hidden")}
          >
            {isMenuOpen ? <Cross2Icon /> : <HamburgerMenuIcon />}
          </Button>

          <div className="hidden space-x-5 md:flex items-center">
            <div className="space-x-2">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <ModeToggle />
                  </NavigationMenuItem>

                  {/* <div className="pl-5">
                    <UserNav />
                  </div> */}
                  <NavigationMenuItem>
                    <Link
                      href="/signin"
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "group",
                        "bg-transparent focus:bg-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800"
                      )}
                    >
                      <span>Log In</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="24"
                        height="24"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="ml-4 h-3 w-3 opacity-0 -translate-x-2 group-hover:translate-x-0 group-hover:opacity-100 transition-all"
                      >
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </Link>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className={cn(
              "fixed top-14 flex w-full flex-col justify-between bg-white dark:bg-slate-900 border-b rounded-b-md z-40 bg-opacity-80 backdrop-blur"
            )}
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col px-6 py-6">
              <div className="flex flex-col gap-5">
                <Link href="/pricing" className="flex items-center gap-3">
                  <RocketIcon /> Pricing
                </Link>
                <Link href="/gallery" className="flex items-center gap-3">
                  <CameraIcon /> Gallery
                </Link>
                <span className="flex items-center gap-3" onClick={toggleTheme}>
                  {theme === "light" ? <MoonIcon /> : <SunIcon />} Toggle theme
                </span>
                <p className="cursor-pointer flex items-center gap-3 mt-4">
                  <ExitIcon /> Logout
                </p>
              </div>
            </div>

            <div className="sticky inset-x-0 bottom-0 border-t border-slate-400 border-opacity-20 px-2">
              <Link
                href="/account"
                className="flex items-center gap-2 p-4 hover:bg-gray-50 justify-between"
              >
                <div className="flex flex-row items-center">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={"/avatar-icon.png"} />
                    <AvatarFallback>
                      <PersonIcon />
                    </AvatarFallback>
                  </Avatar>

                  <div className="ml-3">
                    <p className="text-sm font-medium">email</p>
                    <p className="text-sm leading-none text-muted-foreground">
                      credits
                    </p>
                  </div>
                </div>

                <ArrowRightIcon className="h-5 w-5 mr-2" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
