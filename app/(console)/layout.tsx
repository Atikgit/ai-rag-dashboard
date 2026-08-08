import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

export default function ConsoleLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SidebarProvider defaultOpen>
      <AppSidebar />
      <SidebarInset className="h-svh overflow-hidden">{children}</SidebarInset>
    </SidebarProvider>
  )
}
