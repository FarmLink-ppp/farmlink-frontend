
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  CalendarDays,
  Leaf,
  Settings,
  Crop,
  ChevronsLeft,
  ChevronsRight,
  User,
  UserPlus,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const isMobile = useIsMobile();
  const location = useLocation();

  const menuItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Community", href: "/community", icon: Users },
    { name: "Plant Health", href: "/plant-health", icon: Leaf },
    { name: "Tasks", href: "/tasks", icon: CalendarDays },
    { name: "Chat", href: "/chat", icon: MessageSquare },
    { name: "Land Management", href: "/land-management", icon: Crop },
    { name: "Workers", href: "/workers", icon: UserPlus },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  if (isMobile && collapsed) {
    return null;
  }

  return (
    <aside
      className={cn(
        "flex flex-col h-screen fixed z-40 bg-white/90 backdrop-blur-md border-r border-farmlink-lightgreen/20 shadow-xl transition-all duration-300 ease-in-out",
        collapsed ? "w-20" : "w-64"
      )}
    >
      {/* Logo */}
      <div className="flex items-center justify-center p-4 border-b border-farmlink-lightgreen/20">
        <Link to="/" className="flex items-center space-x-3">
          <div className="relative">
            <img
              src="/uploads/logo.png"
              alt="FarmLink Logo"
              className={cn(
                "transition-all duration-300 object-contain",
                collapsed ? "w-8 h-8" : "w-10 h-10"
              )}
            />
          </div>
          {!collapsed && (
            <h1 className="text-xl font-bold bg-gradient-to-r from-farmlink-darkgreen to-farmlink-green bg-clip-text text-transparent">
              FarmLink
            </h1>
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                "group flex items-center gap-3 p-3 rounded-xl transition-all duration-200",
                isActive 
                  ? "bg-gradient-to-r from-farmlink-green to-farmlink-mediumgreen text-white shadow-lg" 
                  : "text-farmlink-darkgreen hover:bg-farmlink-lightgreen/20 hover:shadow-md"
              )}
            >
              <item.icon className={cn(
                "h-5 w-5 flex-shrink-0 transition-transform group-hover:scale-110",
                isActive ? "text-white" : "text-farmlink-green"
              )} />
              {!collapsed && (
                <span className={cn(
                  "text-sm font-medium transition-colors",
                  isActive ? "text-white" : "text-farmlink-darkgreen"
                )}>
                  {item.name}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Toggle Button */}
      <div className="p-4 border-t border-farmlink-lightgreen/20">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-center p-2 text-farmlink-darkgreen hover:bg-farmlink-lightgreen/20 rounded-xl transition-all duration-200 hover:shadow-md"
        >
          {collapsed ? (
            <ChevronsRight className="h-5 w-5" />
          ) : (
            <ChevronsLeft className="h-5 w-5" />
          )}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;