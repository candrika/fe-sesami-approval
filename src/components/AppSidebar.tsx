import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { Home, Settings } from "lucide-react"
import { Link } from 'react-router-dom'

import { useMemo } from "react";

type MenuItem = {
  title: string;
  url: string;
  icon: React.ElementType;
};

// Semua menu berdasarkan role
const MENU_BY_ROLE: Record<string, MenuItem[]> = {
  User: [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
    },
  ],
  Verifikator: [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
    },
    {
      title: "User Manager",
      url: "/users",
      icon: Settings,
    },
  ],
  Admin: [
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
    },
    {
      title: "User Manager",
      url: "/users",
      icon: Settings,
    },
  ],
};

export function AppSidebar() {

  const role = localStorage.getItem("role") ?? "User";

  const menuItems = useMemo(() => {
    return MENU_BY_ROLE[role] || [];
  }, [role]);

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link to={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}