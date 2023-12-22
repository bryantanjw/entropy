"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { PersonIcon, PlusCircledIcon } from "@radix-ui/react-icons";

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
import { useToast } from "@/components/ui/use-toast";

export function UserNav() {
  const router = useRouter();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-8 w-8 rounded-full flex items-center justify-center"
        >
          <Avatar className="h-8 w-8">
            <AvatarImage src={"/avatar-icon.png"} />
            <AvatarFallback>
              <PersonIcon />
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56 space-y-2" align="end" forceMount>
        <DropdownMenuLabel className="font-normal mt-1">
          <Link
            href={"/account"}
            className="flex flex-col space-y-1 hover:underline underline-offset-2"
          >
            {/* <p className="text-sm font-medium">
              {userDetails?.full_name ?? user.email}
            </p>
            <p className="text-sm leading-none text-muted-foreground">
              {userDetails?.credits ?? 0} credits
            </p> */}
          </Link>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup className="space-y-1">
          <DropdownMenuItem
            asChild
            className="text-muted-foreground cursor-pointer"
          >
            <Link href="/account">Manage account</Link>
          </DropdownMenuItem>
          <div>
            <DropdownMenuItem className="text-muted-foreground cursor-pointer">
              Log out
            </DropdownMenuItem>
          </div>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <div className="mx-2">
          <Link href={"/pricing"}>
            <Button className="w-full flex items-center mb-2 gap-2">
              <PlusCircledIcon />
              Add credits
            </Button>
          </Link>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
