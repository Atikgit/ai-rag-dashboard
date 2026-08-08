"use client"

import * as React from "react"
import { useTheme } from "next-themes"
import { Moon, Sun } from "lucide-react"

import { Button } from "@/components/ui/button"

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => setMounted(true), [])

  const isDark = mounted && resolvedTheme === "dark"

  return (
    <Button
      variant="outline"
      size="sm"
      className="w-full justify-start gap-2 group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      aria-label="Toggle dark mode"
    >
      {mounted ? (
        isDark ? (
          <Sun data-icon="inline-start" />
        ) : (
          <Moon data-icon="inline-start" />
        )
      ) : (
        <Moon data-icon="inline-start" />
      )}
      <span className="group-data-[collapsible=icon]:hidden">
        {mounted && isDark ? "Light mode" : "Dark mode"}
      </span>
    </Button>
  )
}
