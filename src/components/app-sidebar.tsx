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
import { FolderGit2, HousePlugIcon } from "lucide-react"

const data = {
  user: {
    name: "Usuario",
    email: "usuario@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Inicio",
      url: "/init",
      icon: (
        <HousePlugIcon
        />
      ),
    },
    {
      title: "Proyectos",
      url: "/projects",
      icon: (
        <FolderGit2
        />
      ),
    }
  ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:p-1.5!"
            >
              <a href="#">
                {/* <CommandIcon className="size-5!" /> */}
                <img src="/ico.svg" alt="VoltIQ Power Suite" className="size-5!" />
                <span className="text-base font-semibold">VoltIQ Power Suite.</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarSeparator />

      <SidebarContent>
        <SidebarGroup className="pb-0">
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
