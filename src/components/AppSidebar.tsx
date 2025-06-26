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

// Menu items.
let items:any[]= [];

if(localStorage.getItem('role')=='User'){
    items.push({
      title: "Dashboard",
      url: "/",
      icon: Home,
  });
}

if (localStorage.getItem("role") == "Verifikator" || localStorage.getItem("role") == "Admin") {
  items.push(
    {
      title: "Dashboard",
      url: "/",
      icon: Home,
    },
    {
      title: "User Manager",
      url: "/users",
      icon: Settings,
    }
  );
}

// if (localStorage.getItem("role") == "Admin") {
//   items.push(
//     {
//       title: "User Manager",
//       url: "/users",
//       icon: Settings,
//     }
//   );
// }

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
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