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
    { name: "React", icon: "/tech/react.svg", category: "frontend" },
    { name: "Next.js", icon: "/tech/nextjs.svg", category: "frontend" },
    { name: "Vue.js", icon: "/tech/vue.svg", category: "frontend" },
    { name: "Angular", icon: "/tech/angular.svg", category: "frontend" },
    { name: "Svelte", icon: "/tech/svelte.svg", category: "frontend" },
    { name: "HTML5", icon: "/tech/html.svg", category: "frontend" },
    { name: "CSS3", icon: "/tech/css.svg", category: "frontend" },
    { name: "JavaScript", icon: "/tech/javascript.svg", category: "frontend" },
    { name: "TypeScript", icon: "/tech/typescript.svg", category: "frontend" },
    { name: "Tailwind CSS", icon: "/tech/tailwind.svg", category: "frontend" },
    { name: "Bootstrap", icon: "/tech/bootstrap.svg", category: "frontend" },
    { name: "Material UI", icon: "/tech/materialui.svg", category: "frontend" },
    { name: "Redux", icon: "/tech/redux.svg", category: "frontend" },
    { name: "GraphQL", icon: "/tech/graphql.svg", category: "frontend" },

    // Backend
    { name: "Node.js", icon: "/tech/nodejs.svg", category: "backend" },
    { name: "Express", icon: "/tech/express.svg", category: "backend" },
    { name: "Django", icon: "/tech/django.svg", category: "backend" },
    { name: "Flask", icon: "/tech/flask.svg", category: "backend" },
    { name: "Laravel", icon: "/tech/laravel.svg", category: "backend" },
    { name: "Spring Boot", icon: "/tech/spring.svg", category: "backend" },
    { name: "Ruby on Rails", icon: "/tech/rails.svg", category: "backend" },
    { name: "Ruby on Rails", icon: "/tech/rails.svg", category: "backend" },
    { name: "ASP.NET", icon: "/tech/dotnet.svg", category: "backend" },
    { name: "PHP", icon: "/tech/php.svg", category: "backend" },
    { name: "Python", icon: "/tech/python.svg", category: "backend" },
    { name: "Java", icon: "/tech/java.svg", category: "backend" },
    { name: "C#", icon: "/tech/csharp.svg", category: "backend" },

    // Database
    { name: "MongoDB", icon: "/tech/mongodb.svg", category: "database" },
    { name: "PostgreSQL", icon: "/tech/postgresql.svg", category: "database" },
    { name: "MySQL", icon: "/tech/mysql.svg", category: "database" },
    { name: "SQLite", icon: "/tech/sqlite.svg", category: "database" },
    { name: "Redis", icon: "/tech/redis.svg", category: "database" },
    { name: "Firebase", icon: "/tech/firebase.svg", category: "database" },
    { name: "Supabase", icon: "/tech/supabase.svg", category: "database" },

    // Tools
    { name: "Git", icon: "/tech/git.svg", category: "tools" },
    { name: "Docker", icon: "/tech/docker.svg", category: "tools" },
    { name: "AWS", icon: "/tech/aws.svg", category: "tools" },
    { name: "Vercel", icon: "/tech/vercel.svg", category: "tools" },
    { name: "Netlify", icon: "/tech/netlify.svg", category: "tools" },
    { name: "GitHub", icon: "/tech/github.svg", category: "tools" },
    { name: "VS Code", icon: "/tech/vscode.svg", category: "tools" },
    { name: "Figma", icon: "/tech/figma.svg", category: "tools" },
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

