"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut } from "lucide-react";
import { logout } from "@/auth/nextjs/action";
import { Profile } from "./Profile";

export function UserMenu({ email, avatar }: { email: string; avatar: string }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon" className="rounded-full">
          <Profile imgUrl={avatar} />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <div className="px-2 py-1.5">
          <p className="text-sm font-medium">Account</p>
          <p className="text-sm text-muted-foreground truncate">{email}</p>
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={logout}
          className="text-destructive cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
