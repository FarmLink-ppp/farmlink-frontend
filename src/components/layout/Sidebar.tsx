import React from "react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Users,
  MessageSquare,
  CalendarDays,
  Leaf,
  CloudSun,
  Settings,
  Crop,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ collapsed, onToggle }) => {
  const isMobile = useIsMobile();

  const menuItems = [
    { name: "Dashboard", href: "/", icon: LayoutDashboard },
    { name: "Community", href: "/community", icon: Users },
    { name: "Plant Health", href: "/plant-health", icon: Leaf },
    { name: "Tasks", href: "/tasks", icon: CalendarDays },
    { name: "Weather", href: "/weather", icon: CloudSun },
    { name: "Chat", href: "/chat", icon: MessageSquare },
    { name: "Land Management", href: "/land-management", icon: Crop },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  if (isMobile && collapsed) {
    return null;
  }

  return (
    <aside
    className={cn(
      "flex flex-col h-screen fixed z-40 bg-farmlink-mediumgreen shadow-lg transition-all duration-300 ease-in-out",
      collapsed ? "w-20" : "w-64"
    )}
  >
    {/* Logo */}
    <div className="flex items-center justify-center p-4 border-b border-white/10">
      <Link to="/">
        <img
          src="/uploads/ac9862b9-1f21-485d-9c74-b07456464ba9.png"
          alt="FarmLink Logo"
          className={cn(
            "transition-all duration-300 object-contain mx-auto",
            collapsed ? "w-30 h-30" : "w-50 h-50"
          )}
        />
      </Link>
    </div>
  
    {/* Navigation */}
    <nav className="flex-1 overflow-y-auto py-4 px-2 space-y-2">
      {menuItems.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className="group flex items-center gap-3 p-3 text-farmlink-offwhite/90 rounded-md hover:bg-farmlink-mediumgreen/60 transition-colors"
        >
          <item.icon className="h-5 w-5 flex-shrink-0 text-farmlink-offwhite/90 transition-transform group-hover:scale-110" />
          {!collapsed && (
            <span className="text-sm font-medium text-farmlink-offwhite/90">{item.name}</span>
          )}
        </Link>
      ))}
    </nav>
  
    {/* Toggle Button */}
    <div className="p-4 border-t border-white/10">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-center p-2 text-farmlink-offwhite/90 hover:bg-farmlink-mediumgreen/60 rounded-md transition-colors"
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
