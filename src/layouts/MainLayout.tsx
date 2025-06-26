// import { cva, type VariantProps } from "class-variance-authority";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"

import { AppSidebar } from "@/components/AppSidebar"
import { Outlet } from "react-router-dom"
import { SheetDemo } from "@/components/Sheet"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Link } from "react-router-dom"
import { LogOut } from "lucide-react"

export default function MainLayout() {
  return (
    <div>
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />   
          <Button className="flex flex-row items-center" variant="link">
            <LogOut />
            <Link  to="/logout">Logout</Link>
          </Button>
          </header>
          <main className="w-full">
            <Outlet/>
            <div className="fixed bottom-3 right-2">
              <SheetDemo/>
            </div>
          </main>
       </SidebarInset>
    </SidebarProvider>
    </div>
  )
}