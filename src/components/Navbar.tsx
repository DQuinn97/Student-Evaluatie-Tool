import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { CircleUserRound } from "lucide-react";
import { ModeToggler } from "./mode-toggler";

const Navbar = () => {
  return (
    <NavigationMenu className="mb-4 flex max-w-full justify-between border-b border-b-gray-500">
      <NavigationMenuList>
        <NavigationMenuList asChild>
          <img src="https://placehold.co/200x50" alt="" />
        </NavigationMenuList>
        <NavigationMenuLink href="/dashboard">
          <span className="text-lg font-medium">Dashboard</span>
        </NavigationMenuLink>
        <NavigationMenuLink href="/stagedagboek">
          <span className="text-lg font-medium">Stagedagboek</span>
        </NavigationMenuLink>
        <NavigationMenuLink href="/tasks">
          <span className="text-lg font-medium">Tasks</span>
        </NavigationMenuLink>
        <NavigationMenuLink href="/grades">
          <span className="text-lg font-medium">Grades</span>
        </NavigationMenuLink>
        <NavigationMenuLink href="/calendar">
          <span className="text-lg font-medium">Calendar</span>
        </NavigationMenuLink>
      </NavigationMenuList>
      <div className="flex items-center gap-2">
        <ModeToggler />
        <DropdownMenu>
          <DropdownMenuTrigger>
            <CircleUserRound className="size-7 stroke-1" />
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuLabel>Profile</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </NavigationMenu>
  );
};

export default Navbar;
