"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useTheme } from "next-themes";

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
import { User } from "@supabase/supabase-js";

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "./navigation-menu";
import { UserNav } from "../user-nav";
import { Button } from "./button";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { ModeToggle } from "./theme-toggle";

import { useSupabase } from "@/lib/providers/supabase-provider";

interface NavbarProps {
  user: User | null | undefined;
  userDetails?: any;
  dark?: boolean;
}

export default function Nav({ user, userDetails, dark = false }: NavbarProps) {
  const { supabase } = useSupabase();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  if (dark) {
    setTheme("dark");
  }

  return (
    <div>
      <div
        className={cn(
          "fixed top-0 left-0 right-0 z-50 flex items-center justify-between p-6 lg:px-8 sm:flex-row h-14 backdrop-blur-md border-b border-b-slate-500 border-opacity-20 bg-transparent darktext-white"
        )}
      >
        <Link href={"/"} className="text-lg font-semibold">
          Entropy<sup className="text-blue-500 ml-1">beta</sup>
        </Link>
        <div className="ml-auto flex space-x-3 sm:justify items-center">
          <div className="space-x-5 md:flex">
            <div>
              <NavigationMenu>
                <NavigationMenuList className="gap-4 items-center">
                  <NavigationMenuItem>
                    {!dark && <ModeToggle />}
                  </NavigationMenuItem>

                  {user ? (
                    <div>
                      <UserNav user={user} userDetails={userDetails} />
                    </div>
                  ) : (
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
                  )}
                </NavigationMenuList>
              </NavigationMenu>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
