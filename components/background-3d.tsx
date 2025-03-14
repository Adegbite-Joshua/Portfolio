"use client"

import { useTheme } from "@/providers/theme-provider"
import { useEffect, useRef, useState } from "react"
import * as THREE from "three"

export function Background3D() {
  const [vantaEffect, setVantaEffect] = useState<any>(null)
  const myRef = useRef(null)
  const { theme } = useTheme() // Get current theme
  console.log(theme);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const backgroundColor = theme === "dark" ? 0x1a1a2e : 0xf8f9fa
      const color = theme === "dark" ? 0xf8f9fa : 0x1a1a2e
      import("vanta/dist/vanta.net.min.js").then((VANTA) => {
        if (vantaEffect) vantaEffect.destroy()

        setVantaEffect(
          VANTA.default({
            el: myRef.current,
            THREE,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.00,
            minWidth: 200.00,
            scale: 1.00,
            scaleMobile: 1.00,
            color,
            points: 5.00,
            speed: 4.00,
            maxDistance: 19.00,
            spacing: 20.00,
            backgroundColor,
            vertexColors: false, // Explicitly set to avoid undefined error
          })
        )
      })
    }

    return () => {
      if (vantaEffect) vantaEffect.destroy()
    }
  }, [theme])

  return <div ref={myRef} className="fixed inset-0 top-0 left-0 w-full h-full bg-background">
  </div>
}
