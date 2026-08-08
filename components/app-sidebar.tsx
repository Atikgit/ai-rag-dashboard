"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { MessageSquareText, LayoutDashboard, Cpu } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { ThemeToggle } from "@/components/theme-toggle"
import { Badge } from "@/components/ui/badge"

const NAV_ITEMS = [
  {
    title: "Chat",
    url: "/",
    icon: MessageSquareText,
    description: "Conversational interface",
  },
  {
    title: "Knowledge Base",
    url: "/dashboard",
    icon: LayoutDashboard,
    description: "RAG administration",
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="border-b border-sidebar-border">
        <div className="flex items-center gap-2 px-2 py-1.5">
          <div className="flex size-7 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Cpu className="size-4" />
          </div>
          <div className="flex flex-col overflow-hidden group-data-[collapsible=icon]:hidden">
            <span className="truncate text-sm font-semibold leading-none">
              Cortex
            </span>
            <span className="truncate text-[11px] font-mono-label text-muted-foreground leading-none mt-1">
              RAG CONSOLE
            </span>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="font-mono-label text-[10px]">
            Workspace
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map((item) => (
                <SidebarMenuItem key={item.url}>
                  <SidebarMenuButton
                    isActive={pathname === item.url}
                    tooltip={item.title}
                    render={
                      <Link href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </Link>
                    }
                  />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border gap-3">
        <div className="flex items-center justify-between px-1 group-data-[collapsible=icon]:hidden">
          <div className="flex items-center gap-2">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
              <span className="relative inline-flex size-2 rounded-full bg-success" />
            </span>
            <span className="text-xs font-mono-label text-muted-foreground">
              INDEX ONLINE
            </span>
          </div>
          <Badge variant="secondary" className="font-mono-label text-[10px]">
            v2.4.1
          </Badge>
        </div>
        <ThemeToggle />
      </SidebarFooter>
    </Sidebar>
  )
}
