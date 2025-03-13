"use client"

import { useEffect, useState } from "react"

export function CursorEffect() {
  const [position, setPosition] = useState({ x: 0, y: 0 })
  const [isPointer, setIsPointer] = useState(false)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const updatePosition = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY })
    }

    const updateCursorType = () => {
      const hoveredElement = document.elementFromPoint(position.x, position.y)
      const isPointerElement = hoveredElement?.closest('a, button, [role="button"]')
      setIsPointer(!!isPointerElement)
    }

    const handleMouseEnter = () => setIsVisible(true)
    const handleMouseLeave = () => setIsVisible(false)

    window.addEventListener("mousemove", updatePosition)
    window.addEventListener("mouseover", updateCursorType)
    document.addEventListener("mouseenter", handleMouseEnter)
    document.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", updatePosition)
      window.removeEventListener("mouseover", updateCursorType)
      document.removeEventListener("mouseenter", handleMouseEnter)
      document.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [position.x, position.y])

  return (
    <>
      <div
        className={`fixed pointer-events-none z-50 h-6 w-6 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/30 mix-blend-screen transition-transform duration-300 ease-out ${
          isPointer ? "scale-150" : "scale-100"
        } ${isVisible ? "opacity-100" : "opacity-0"}`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
          boxShadow: "0 0 20px 5px rgba(99, 102, 241, 0.3)",
        }}
      />
      <div
        className={`fixed pointer-events-none z-50 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary transition-opacity duration-300 ${
          isVisible ? "opacity-100" : "opacity-0"
        }`}
        style={{
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      />
    </>
  )
}

