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
import { Settings2Icon, CircleHelpIcon, SearchIcon, DatabaseIcon, FileChartColumnIcon, FileIcon, CalculatorIcon, BookMarkedIcon, RulerDimensionLineIcon, WaypointsIcon } from "lucide-react"

const data = {
  user: {
    name: "Usuario",
    email: "usuario@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Calcular red",
      url: "RedCalculator",
      icon: (
        <CalculatorIcon
        />
      ),
    },
    {
      title: "Validar norma",
      url: "NormaValidator",
      icon: (
        <BookMarkedIcon
        />
      ),
    },
    {
      title: "Calcular materiales",
      url: "MaterialsCalculator",
      icon: (
        <RulerDimensionLineIcon
        />
      ),
    },
    {
      title: "Dibujar red",
      url: "RedDrawer",
      icon: (
        <WaypointsIcon
        />
      ),
    }
  ],
  
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: (
        <Settings2Icon
        />
      ),
    },
    {
      title: "Get Help",
      url: "#",
      icon: (
        <CircleHelpIcon
        />
      ),
    },
    {
      title: "Search",
      url: "#",
      icon: (
        <SearchIcon
        />
      ),
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: (
        <DatabaseIcon
        />
      ),
    },
    {
      name: "Reports",
      url: "#",
      icon: (
        <FileChartColumnIcon
        />
      ),
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: (
        <FileIcon
        />
      ),
    },
  ],
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
        {/* <NavDocuments items={data.documents} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  )
}
