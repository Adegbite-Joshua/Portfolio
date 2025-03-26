"use client"

import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/providers/theme-provider"
import Image from "next/image"

interface TechItem {
  name: string
  icon: string
  category: "frontend" | "backend" | "database" | "tools"
}

export function AutoScrollingTechStack() {
  const { theme } = useTheme()
  const scrollerRef = useRef<HTMLDivElement>(null)

  const techStack: TechItem[] = [
    // Frontend
    { name: "React", icon: "/react.png", category: "frontend" },
    { name: "Next.js", icon: "/nextjs.svg", category: "frontend" },
    // { name: "Vue.js", icon: "/vue.png", category: "frontend" },
    { name: "Angular", icon: "/angular.png", category: "frontend" },
    // { name: "Svelte", icon: "/svelte.png", category: "frontend" },
    { name: "HTML5", icon: "/html.png", category: "frontend" },
    { name: "CSS3", icon: "/css.png", category: "frontend" },
    { name: "JavaScript", icon: "/javascript.png", category: "frontend" },
    { name: "TypeScript", icon: "/typescript.png", category: "frontend" },
    { name: "Tailwind CSS", icon: "/tailwind.png", category: "frontend" },
    { name: "Bootstrap", icon: "/bootstrap5.svg", category: "frontend" },
    { name: "Material UI", icon: "/mui.png", category: "frontend" },
    { name: "Redux", icon: "/redux.png", category: "frontend" },
    // { name: "GraphQL", icon: "/graphql.png", category: "frontend" },

    // Backend
    { name: "Node.js", icon: "/nodejs.png", category: "backend" },
    { name: "Express", icon: "/expressjs.png", category: "backend" },
    // { name: "Django", icon: "/django.png", category: "backend" },
    { name: "Flask", icon: "/flask.png", category: "backend" },
    { name: "Laravel", icon: "/laravel.png", category: "backend" },
    // { name: "Spring Boot", icon: "/spring.png", category: "backend" },
    // { name: "Ruby on Rails", icon: "/rails.png", category: "backend" },
    // { name: "ASP.NET", icon: "/dotnet.png", category: "backend" },
    { name: "PHP", icon: "/php.png", category: "backend" },
    { name: "Python", icon: "/python.png", category: "backend" },
    // { name: "Java", icon: "/java.png", category: "backend" },
    // { name: "C#", icon: "/csharp.png", category: "backend" },

    // Database
    { name: "MongoDB", icon: "/mongodb.png", category: "database" },
    // { name: "PostgreSQL", icon: "/postgresql.png", category: "database" },
    { name: "MySQL", icon: "/mysql.png", category: "database" },
    // { name: "SQLite", icon: "/sqlite.png", category: "database" },
    // { name: "Redis", icon: "/redis.png", category: "database" },
    { name: "Firebase", icon: "/firebase.webp", category: "database" },
    // { name: "Supabase", icon: "/supabase.png", category: "database" },

    // Tools
    { name: "Git", icon: "/git.png", category: "tools" },
    // { name: "Docker", icon: "/docker.png", category: "tools" },
    // { name: "AWS", icon: "/aws.png", category: "tools" },
    { name: "Vercel", icon: "/vercel.png", category: "tools" },
    { name: "Netlify", icon: "/netlify.png", category: "tools" },
    { name: "GitHub", icon: "/github.png", category: "tools" },
    { name: "VS Code", icon: "/vscode.png", category: "tools" },
    { name: "Figma", icon: "/figma.png", category: "tools" },
  ]

  useEffect(() => {
    if (!scrollerRef.current) return

    // Clone the content for seamless scrolling
    const scrollerContent = Array.from(scrollerRef.current.children)
    scrollerContent.forEach((item) => {
      const clone = item.cloneNode(true)
      scrollerRef.current?.appendChild(clone)
    })

    // Add animation
    scrollerRef.current.setAttribute(
      "style",
      `animation: scroll 60s linear infinite; width: calc(${scrollerContent.length * 140}px * 2)`,
    )

    // Pause on hover
    const handleMouseEnter = () => {
      if (scrollerRef.current) {
        scrollerRef.current.style.animationPlayState = "paused"
      }
    }

    const handleMouseLeave = () => {
      if (scrollerRef.current) {
        scrollerRef.current.style.animationPlayState = "running"
      }
    }

    scrollerRef.current.addEventListener("mouseenter", handleMouseEnter)
    scrollerRef.current.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      if (scrollerRef.current) {
        scrollerRef.current.removeEventListener("mouseenter", handleMouseEnter)
        scrollerRef.current.removeEventListener("mouseleave", handleMouseLeave)
      }
    }
  }, [])

  return (
    <div className="w-full py-8 overflow-hidden">
      <style jsx global>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>

      <div className="relative w-full overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-r from-background to-transparent"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-l from-background to-transparent"></div>

        <div className="flex overflow-hidden">
          <div ref={scrollerRef} className="flex gap-6 py-4 px-4">
            {techStack.map((tech, index) => (
              <div
                key={index}
                className={cn(
                  "flex flex-col items-center justify-center min-w-[120px] h-32 p-4 rounded-lg transition-all duration-300 transform hover:scale-105",
                  theme === "dark"
                    ? "bg-gray-800/50 hover:bg-gray-800/80 border border-gray-700"
                    : "bg-gray-100/50 hover:bg-gray-100/80 border border-gray-200",
                )}
              >
                <div className="relative w-12 h-12 mb-3">
                  <Image
                    src={tech.icon || "/placeholder.svg"}
                    alt={tech.name}
                    width={48}
                    height={48}
                    className="object-contain"
                    onError={(e) => {
                      // Fallback for missing icons
                      const target = e.target as HTMLImageElement
                      target.src = "/placeholder.svg?height=48&width=48"
                    }}
                  />
                </div>
                <span className="text-sm font-medium text-center">{tech.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center mt-4">
        <p className="text-sm text-muted-foreground">Hover to pause, mouse out to continue</p>
      </div>
    </div>
  )
}

