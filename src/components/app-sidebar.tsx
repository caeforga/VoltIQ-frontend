import * as React from "react"
import { NavMain } from "@/components/nav-main"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { cn } from "@/lib/utils"
import { FolderGit2, HousePlugIcon, Network } from "lucide-react"

const data = {
  user: {
    name: "Usuario",
    email: "usuario@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Crear proyecto",
      url: "/create-project",
      icon: (
        <HousePlugIcon
        />
      ),
    },
    {
      title: "Mis proyectos",
      url: "/my-projects",
      icon: (
        <FolderGit2
        />
      ),
    },
    {
      title: "Editor de red",
      url: "/network",
      icon: (
        <Network
        />
      ),
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className={cn(
                "data-[slot=sidebar-menu-button]:p-1.5!",
                "group-data-[collapsible=icon]:h-14!",
                "group-data-[collapsible=icon]:w-full!",
                "group-data-[collapsible=icon]:justify-center!",
                "group-data-[collapsible=icon]:p-2!",
              )}
            >
              <a href="#">
                <img
                  src="/ico.svg"
                  alt="VoltIQ Power Suite"
                  className="size-5! group-data-[collapsible=icon]:size-9!"
                />
                <span className="text-base font-semibold group-data-[collapsible=icon]:hidden">VoltIQ Power Suite.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator className="group-data-[collapsible=icon]:hidden" />

      <SidebarContent>
        <SidebarGroup className="pb-0 group-data-[collapsible=icon]:hidden">
          <SidebarGroupLabel className="h-auto whitespace-normal py-2 text-[0.7rem] font-semibold leading-tight tracking-wider text-sidebar-foreground/60 uppercase">
            Sistema de análisis de redes eléctricas de distribución
          </SidebarGroupLabel>
        </SidebarGroup>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
