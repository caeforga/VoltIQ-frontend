import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link, useLocation } from "react-router-dom"
import { cn } from "@/lib/utils"

const collapsedItemClasses = cn(
  "group-data-[collapsible=icon]:w-full!",
  "group-data-[collapsible=icon]:h-auto!",
  "group-data-[collapsible=icon]:min-h-16!",
  "group-data-[collapsible=icon]:py-2.5!",
  "group-data-[collapsible=icon]:px-1!",
  "group-data-[collapsible=icon]:flex-col",
  "group-data-[collapsible=icon]:items-center",
  "group-data-[collapsible=icon]:justify-center",
  "group-data-[collapsible=icon]:gap-1.5",
  "group-data-[collapsible=icon]:[&>svg]:size-7!",
  "group-data-[collapsible=icon]:[&>span:last-child]:text-[0.65rem]",
  "group-data-[collapsible=icon]:[&>span:last-child]:font-medium",
  "group-data-[collapsible=icon]:[&>span:last-child]:leading-tight",
  "group-data-[collapsible=icon]:[&>span:last-child]:text-center",
  "group-data-[collapsible=icon]:[&>span:last-child]:whitespace-normal",
)

function isItemActive(pathname: string, url: string): boolean {
  if (!url || url === "#") return false
  if (pathname === url) return true
  return pathname.startsWith(url + "/")
}

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
  }[]
}) {
  const { pathname } = useLocation()

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:px-1.5 group-data-[collapsible=icon]:pt-1">
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu className="group-data-[collapsible=icon]:gap-1.5">
          {items.map((item) => {
            const active = isItemActive(pathname, item.url)
            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={active}
                  tooltip={item.title}
                  className={collapsedItemClasses}
                >
                  <Link to={item.url}>
                    {item.icon}
                    <span>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
