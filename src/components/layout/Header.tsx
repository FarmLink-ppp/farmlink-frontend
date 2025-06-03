import React from "react";
import { Bell, Search, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";

interface HeaderProps {
  sidebarCollapsed: boolean;
}

const Header: React.FC<HeaderProps> = () => {
  return (     

    <header className="bg-radial from-farmlink-lightgreen via-farmlink-mediumgreen to-farmlink-green
">
    <div className="h-16 px-6 flex items-center justify-between relative">
      {/* Centered Search */}
      
  
      {/* Right side actions */}
      <div className="flex items-center space-x-4 ml-auto">
        <Button variant="ghost" size="icon" className="relative text-farmlink-darkgreen hover:bg-farmlink-lightgreen/50 focus:ring-2 focus:ring-farmlink-green">
          <Bell className="h-5 w-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-farmlink-mediumgreen rounded-full" />
        </Button>
  
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full text-farmlink-darkgreen hover:bg-farmlink-lightgreen/50 focus:ring-2 focus:ring-farmlink-green">
              <User className="h-5 w-5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-offwhite text-farmlink-darkgreen">
            <DropdownMenuLabel className="text-farmlink-green">My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:bg-farmlink-lightgreen">Profile</DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-farmlink-lightgreen">Settings</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="hover:bg-farmlink-lightgreen">Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  </header>
  


  );
};

export default Header;
