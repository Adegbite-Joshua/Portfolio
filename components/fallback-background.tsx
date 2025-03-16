"use client"

import { useTheme } from "@/providers/theme-provider"

export function FallbackBackground() {
  const { theme } = useTheme()

  return (
    <div
      className="fixed inset-0 -z-10 w-full h-full"
      style={{
        background:
          theme === "dark"
            ? "radial-gradient(circle at 50% 50%, #1e1e2f, #111827)"
            : "radial-gradient(circle at 50% 50%, #f5f5ff, #ffffff)",
      }}
      aria-hidden="true"
    />
  )
}

