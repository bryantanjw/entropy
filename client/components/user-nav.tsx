"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { User } from "@supabase/supabase-js";
import {
  ChatBubbleIcon,
  DashboardIcon,
  ExitIcon,
  PersonIcon,
  PlusCircledIcon,
  ShadowIcon,
} from "@radix-ui/react-icons";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

import { useSupabase } from "@/app/supabase-provider";
import { Badge } from "./ui/badge";

interface Props {
  user: User | null | undefined;
  userDetails?: any;
}

export function UserNav({ user, userDetails }: Props) {
  const { supabase } = useSupabase();
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-7 w-7 rounded-full flex items-center justify-center"
        >
          <Avatar className="h-7 w-7">
            <AvatarImage
              src={user.user_metadata.avatar_url ?? "/avatar-icon.png"}
              alt={userDetails?.full_name ?? user.email}
            />
            <AvatarFallback>
              <PersonIcon />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-72 space-y-2 rounded-xl"
        align="end"
        forceMount
      >
        <DropdownMenuLabel className="flex font-normal mt-1 justify-between items-center">
          <Link
            href={"/account"}
            className="hover:underline underline-offset-2 text-sm"
          >
            {userDetails?.full_name ?? user.email}
          </Link>
          <Link href={"/subscription"}>
            <Button
              variant="outline"
              className="h-fit text-sm leading-none font-medium rounded-full px-2 py-1.5 shadow-sm"
            >
              <ShadowIcon className="h-4 w-4 mr-2" />
              {userDetails?.credits ?? 0}
            </Button>
          </Link>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="space-y-1 py-2">
          <DropdownMenuItem
            asChild
            className="text-muted-foreground cursor-pointer rounded-md py-2"
          >
            <Link href="/">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-layout-dashboard w-5 h-5 mr-4"
                width="44"
                height="44"
                viewBox="0 0 24 24"
                strokeWidth="1"
                stroke="#2c3e50"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M4 4h6v8h-6z" />
                <path d="M4 16h6v4h-6z" />
                <path d="M14 12h6v8h-6z" />
                <path d="M14 4h6v4h-6z" />
              </svg>
              Explore
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            className="text-muted-foreground cursor-pointer rounded-md py-2"
          >
            <Link href="/profile">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-user w-5 h-5 mr-4"
                width="44"
                height="44"
                viewBox="0 0 24 24"
                strokeWidth="1"
                stroke="#2c3e50"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M8 7a4 4 0 1 0 8 0a4 4 0 0 0 -8 0" />
                <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" />
              </svg>
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            className="text-muted-foreground cursor-pointer rounded-md py-2"
          >
            <Link href="/subscription">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-credit-card w-5 h-5 mr-4"
                width="44"
                height="44"
                viewBox="0 0 24 24"
                strokeWidth="1"
                stroke="#2c3e50"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M3 5m0 3a3 3 0 0 1 3 -3h12a3 3 0 0 1 3 3v8a3 3 0 0 1 -3 3h-12a3 3 0 0 1 -3 -3z" />
                <path d="M3 10l18 0" />
                <path d="M7 15l.01 0" />
                <path d="M11 15l2 0" />
              </svg>
              Subscription & Billing
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            className="text-muted-foreground cursor-pointer rounded-md py-2"
          >
            <Link href="https://entropy.so/pricing" target="_blank">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-coin w-5 h-5 mr-4"
                width="44"
                height="44"
                viewBox="0 0 24 24"
                strokeWidth="1"
                stroke="#2c3e50"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                <path d="M14.8 9a2 2 0 0 0 -1.8 -1h-2a2 2 0 1 0 0 4h2a2 2 0 1 1 0 4h-2a2 2 0 0 1 -1.8 -1" />
                <path d="M12 7v10" />
              </svg>
              Pricing
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem
            asChild
            className="text-muted-foreground cursor-pointer rounded-md py-2"
          >
            <Link href="https://instagram.com/entropy.so" target="_blank">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-message-circle w-5 h-5 mr-4"
                width="44"
                height="44"
                viewBox="0 0 24 24"
                strokeWidth="1"
                stroke="#2c3e50"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M3 20l1.3 -3.9c-2.324 -3.437 -1.426 -7.872 2.1 -10.374c3.526 -2.501 8.59 -2.296 11.845 .48c3.255 2.777 3.695 7.266 1.029 10.501c-2.666 3.235 -7.615 4.215 -11.574 2.293l-4.7 1" />
              </svg>
              Instagram
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <DropdownMenuGroup className="space-y-1 py-1">
          <DropdownMenuItem
            onClick={async () => {
              const { error } = await supabase.auth.signOut();
              if (error) {
                console.error("Error signing out:", error.message);
                toast.error("Uh oh! Something went wrong.", {
                  description: error.message || "Failed to sign out.",
                });
                return;
              }
              router.push("/signin");
            }}
            className="text-muted-foreground cursor-pointer py-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="icon icon-tabler icon-tabler-logout w-5 h-5 mr-4"
              width="44"
              height="44"
              viewBox="0 0 24 24"
              strokeWidth="1"
              stroke="#2c3e50"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2" />
              <path d="M9 12h12l-3 -3" />
              <path d="M18 15l3 -3" />
            </svg>
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
