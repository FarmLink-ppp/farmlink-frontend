
import React, { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import Sidebar from "./Sidebar";
import Header from "./Header";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const isMobile = useIsMobile();
  const [collapsed, setCollapsed] = useState(isMobile);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-farmlink-offwhite via-white to-farmlink-offwhite flex">
      <Sidebar collapsed={collapsed} onToggle={toggleSidebar} />
      <div className={`flex-1 transition-all duration-300 ${
        collapsed ? "ml-16" : "ml-64"
      }`}>
        <Header sidebarCollapsed={collapsed} />
        <main className="p-6">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;