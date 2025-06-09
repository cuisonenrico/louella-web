"use client"

import {  type LucideIcon } from "lucide-react"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { usePathname } from "next/navigation"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: LucideIcon
  }[]
}) {
  const pathName = usePathname()

  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          {items.map((item) => (
            <a href={item.url} key={item.title}>
              <SidebarMenuItem >
                <SidebarMenuButton isActive={pathName === item.url ? true : false} tooltip={item.title}>
                  {item.icon && <item.icon />}
                  <li className={pathName === item.url ? "font-bold" : "font-normal"}>
                    {item.title}
                  </li>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </a>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
