"use client";

import { cn } from "@opium/ui/lib/utils";
import { useState } from "react";
import { SidebarHeader } from "./sidebar/sidebar-header";
import { SidebarLibrary } from "./sidebar/sidebar-library";
import { SidebarNavigation } from "./sidebar/sidebar-navigation";
import { SidebarSearch } from "./sidebar/sidebar-search";
import { SidebarUserMenu } from "./sidebar/sidebar-user-menu";

export const Sidebar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);

  return (
    <div
      className={cn(
        "relative top-0 bottom-0 left-0 z-50 flex h-dvh shrink-0 flex-col py-2 transition-all duration-200",
        isSidebarOpen ? "top-0 h-full w-[200px]" : "w-[50px]"
      )}
    >
      <div className="flex w-full flex-1 flex-col items-start overflow-hidden">
        <SidebarHeader isSidebarOpen={isSidebarOpen} onToggle={toggleSidebar} />

        <SidebarSearch isSidebarOpen={isSidebarOpen} />

        <SidebarNavigation isSidebarOpen={isSidebarOpen} />

        <SidebarLibrary isSidebarOpen={isSidebarOpen} />

        <SidebarUserMenu
          isSidebarOpen={isSidebarOpen}
          onToggle={toggleSidebar}
        />
      </div>
    </div>
  );
};
