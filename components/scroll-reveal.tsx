"use client"

import { useEffect, useRef, type ReactNode } from "react"
import { cn } from "@/lib/utils"

interface ScrollRevealProps {
  children: ReactNode
  className?: string
  delay?: number
  direction?: "up" | "down" | "left" | "right"
  distance?: number
  once?: boolean
}

export function ScrollReveal({
  children,
  className,
  delay = 0,
  direction = "up",
  distance = 50,
  once = true,
}: ScrollRevealProps) {
  const elementRef = useRef<HTMLDivElement>(null)
  const hasAnimated = useRef(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const getTransform = () => {
      switch (direction) {
        case "up":
          return `translateY(${distance}px)`
        case "down":
          return `translateY(-${distance}px)`
        case "left":
          return `translateX(${distance}px)`
        case "right":
          return `translateX(-${distance}px)`
        default:
          return `translateY(${distance}px)`
      }
    }

    // Set initial styles
    element.style.opacity = "0"
    element.style.transform = getTransform()
    element.style.transition = `opacity 0.6s ease-out, transform 0.6s ease-out`
    element.style.transitionDelay = `${delay}ms`

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (once && hasAnimated.current) return

            element.style.opacity = "1"
            element.style.transform = "translate(0, 0)"
            hasAnimated.current = true

            if (once) {
              observer.unobserve(element)
            }
          } else if (!once) {
            element.style.opacity = "0"
            element.style.transform = getTransform()
            hasAnimated.current = false
          }
        })
      },
      { threshold: 0.1 },
    )

    observer.observe(element)

    return () => {
      observer.unobserve(element)
    }
  }, [delay, direction, distance, once])

  return (
    <div ref={elementRef} className={cn(className)}>
      {children}
    </div>
  )
}

