import React, { useEffect } from "react";
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
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface HeaderProps {
  sidebarCollapsed: boolean;
}

const Header: React.FC<HeaderProps> = () => {
  const { logout, error } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (error) {
      toast({
        title: "Logout Error",
        description: error,
        variant: "destructive",
      });
    }
  }, [error, toast]);

  const handleLogout = async () => {
    await logout();
  };
  return (
    <header className="w-full sticky top-0 z-30 backdrop-blur-md bg-white/80 border-b border-farmlink-lightgreen/20 transition-all duration-300">
      <div className="h-16 px-6 flex items-center justify-between relative">
        {/* Right side actions */}
        <div className="flex items-center space-x-4 ml-auto">
          <Button
            variant="ghost"
            size="icon"
            className="relative text-farmlink-darkgreen hover:bg-farmlink-lightgreen/20 focus:ring-2 focus:ring-farmlink-green rounded-xl transition-all duration-200"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-farmlink-green rounded-full animate-pulse" />
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-farmlink-darkgreen hover:bg-farmlink-lightgreen/20 focus:ring-2 focus:ring-farmlink-green transition-all duration-200"
              >
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="bg-white/90 backdrop-blur-md text-farmlink-darkgreen border-farmlink-lightgreen/30 shadow-xl rounded-xl"
            >
              <DropdownMenuLabel className="text-farmlink-green font-semibold">
                My Account
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-farmlink-lightgreen/30" />
              <DropdownMenuItem className="hover:bg-farmlink-lightgreen/20 transition-colors duration-200">
                Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-farmlink-lightgreen/20 transition-colors duration-200">
                Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-farmlink-lightgreen/30" />
              <DropdownMenuItem
                onSelect={handleLogout}
                className="hover:bg-farmlink-lightgreen/20 transition-colors duration-200"
              >
                Log out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
