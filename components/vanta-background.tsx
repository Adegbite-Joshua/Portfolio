"use client"

import { useEffect, useRef, useState } from "react"
import { useTheme } from "@/providers/theme-provider"
import dynamic from "next/dynamic"

// Component that will be loaded only on client side
function VantaBackgroundClient() {
  const vantaRef = useRef<HTMLDivElement>(null)
  const [vantaEffect, setVantaEffect] = useState<any>(null)
  const { theme } = useTheme()

  useEffect(() => {
    // Dynamically import THREE and Vanta
    const loadVanta = async () => {
      try {
        const THREE = await import("three")
        const VANTA = await import("vanta/dist/vanta.net.min")

        if (vantaEffect) vantaEffect.destroy()

        const newEffect = VANTA.default({
          el: vantaRef.current,
          THREE: THREE,
          mouseControls: true,
          touchControls: true,
          gyroControls: false,
          minHeight: 200.0,
          minWidth: 200.0,
          scale: 1.0,
          scaleMobile: 1.0,
          color: theme === "dark" ? 0x6366f1 : 0x6366f1,
          backgroundColor: theme === "dark" ? 0x111827 : 0xffffff,
          points: 12,
          maxDistance: 25.0,
          spacing: 16.0,
        })

        setVantaEffect(newEffect)
      } catch (error) {
        console.error("Failed to load Vanta:", error)
      }
    }

    loadVanta()

    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [theme])

  return (
    <div
      ref={vantaRef}
      className="fixed inset-0 -z-10 w-full h-full"
      style={{ position: "fixed", zIndex: -10, width: "100%", height: "100%" }}
      aria-hidden="true"
    />
  )
}

// Export a dynamic component with SSR disabled
export const VantaBackground = dynamic(() => Promise.resolve(VantaBackgroundClient), { ssr: false })

