"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { useTheme } from "@/providers/theme-provider"
import Image from "next/image"

interface TechItem {
  name: string
  icon: string
  category: "frontend" | "backend" | "database" | "tools"
}

export function TechStackCarousel() {
  const { theme } = useTheme()
  const [activeCategory, setActiveCategory] = useState<string>("all")
  const containerRef = useRef<HTMLDivElement>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [startX, setStartX] = useState(0)
  const [scrollLeft, setScrollLeft] = useState(0)

  const techStack: TechItem[] = [
    // Frontend
    { name: "React", icon: "/react.png", category: "frontend" },
    { name: "Next.js", icon: "/nextjs.svg", category: "frontend" },
    { name: "Vue.js", icon: "/tech/vue.svg", category: "frontend" },
    { name: "Angular", icon: "/angular.png", category: "frontend" },
    { name: "Svelte", icon: "/tech/svelte.svg", category: "frontend" },
    { name: "HTML5", icon: "/html.png", category: "frontend" },
    { name: "CSS3", icon: "/css.png", category: "frontend" },
    { name: "JavaScript", icon: "/javascript.png", category: "frontend" },
    { name: "TypeScript", icon: "/typescript.png", category: "frontend" },
    { name: "Tailwind CSS", icon: "/tailwind.png", category: "frontend" },
    { name: "Bootstrap", icon: "/bootstrap5.svg", category: "frontend" },
    { name: "Material UI", icon: "/mui.png", category: "frontend" },
    { name: "Redux", icon: "/redux.png", category: "frontend" },
    { name: "MySQL", icon: "/tech/mysql.png", category: "frontend" },

    // Backend
    { name: "Node.js", icon: "/nodejs.png", category: "backend" },
    { name: "Express", icon: "/expressjs.png", category: "backend" },
    // { name: "Django", icon: "/tech/django.svg", category: "backend" },
    { name: "Flask", icon: "/flask.png", category: "backend" },
    { name: "Laravel", icon: "/laravel.png", category: "backend" },
    // { name: "Spring Boot", icon: "/tech/spring.svg", category: "backend" },
    // { name: "Ruby on Rails", icon: "/tech/rails.svg", category: "backend" },
    // { name: "ASP.NET", icon: "/tech/dotnet.svg", category: "backend" },
    { name: "PHP", icon: "/php.png", category: "backend" },
    { name: "Python", icon: "/python.png", category: "backend" },
    // { name: "Java", icon: "/tech/java.svg", category: "backend" },
    // { name: "C#", icon: "/tech/csharp.svg", category: "backend" },

    // Database
    { name: "MongoDB", icon: "/mongodb.svg", category: "database" },
    // { name: "PostgreSQL", icon: "/tech/postgresql.svg", category: "database" },
    { name: "MySQL", icon: "/mysql.png", category: "database" },
    // { name: "SQLite", icon: "/tech/sqlite.svg", category: "database" },
    // { name: "Redis", icon: "/tech/redis.svg", category: "database" },
    { name: "Firebase", icon: "/firebase.webp", category: "database" },
    // { name: "Supabase", icon: "/tech/supabase.svg", category: "database" },

    // Tools
    { name: "Git", icon: "/git.png", category: "tools" },
    // { name: "Docker", icon: "/tech/docker.svg", category: "tools" },
    // { name: "AWS", icon: "/tech/aws.svg", category: "tools" },
    { name: "Vercel", icon: "/vercel.png", category: "tools" },
    { name: "Netlify", icon: "/netlify.png", category: "tools" },
    { name: "GitHub", icon: "/github.png", category: "tools" },
    // { name: "VS Code", icon: "/vscode.svg", category: "tools" },
    { name: "Figma", icon: "/tech/figma.png", category: "tools" },
  ]

  const filteredTechStack =
    activeCategory === "all" ? techStack : techStack.filter((tech) => tech.category === activeCategory)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!containerRef.current) return
    setIsDragging(true)
    setStartX(e.pageX - containerRef.current.offsetLeft)
    setScrollLeft(containerRef.current.scrollLeft)
  }

  const handleMouseUp = () => {
    setIsDragging(false)
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !containerRef.current) return
    e.preventDefault()
    const x = e.pageX - containerRef.current.offsetLeft
    const walk = (x - startX) * 2
    containerRef.current.scrollLeft = scrollLeft - walk
  }

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault()
      container.scrollLeft += e.deltaY
    }

    container.addEventListener("wheel", handleWheel, { passive: false })

    return () => {
      container.removeEventListener("wheel", handleWheel)
    }
  }, [])

  return (
    <div className="w-full py-8">
      <div className="flex justify-center mb-6 space-x-2">
        <button
          onClick={() => setActiveCategory("all")}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all",
            activeCategory === "all"
              ? "bg-primary text-primary-foreground"
              : "bg-primary/10 text-primary hover:bg-primary/20",
          )}
        >
          All
        </button>
        <button
          onClick={() => setActiveCategory("frontend")}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all",
            activeCategory === "frontend"
              ? "bg-primary text-primary-foreground"
              : "bg-primary/10 text-primary hover:bg-primary/20",
          )}
        >
          Frontend
        </button>
        <button
          onClick={() => setActiveCategory("backend")}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all",
            activeCategory === "backend"
              ? "bg-primary text-primary-foreground"
              : "bg-primary/10 text-primary hover:bg-primary/20",
          )}
        >
          Backend
        </button>
        <button
          onClick={() => setActiveCategory("database")}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all",
            activeCategory === "database"
              ? "bg-primary text-primary-foreground"
              : "bg-primary/10 text-primary hover:bg-primary/20",
          )}
        >
          Database
        </button>
        <button
          onClick={() => setActiveCategory("tools")}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium transition-all",
            activeCategory === "tools"
              ? "bg-primary text-primary-foreground"
              : "bg-primary/10 text-primary hover:bg-primary/20",
          )}
        >
          Tools
        </button>
      </div>

      <div className="relative w-full overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-r from-background to-transparent"></div>
        <div className="absolute right-0 top-0 bottom-0 w-16 z-10 pointer-events-none bg-gradient-to-l from-background to-transparent"></div>

        <div
          ref={containerRef}
          className="flex overflow-x-auto scrollbar-hide py-4 px-4 gap-6 cursor-grab"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onMouseMove={handleMouseMove}
          style={{ scrollBehavior: "smooth" }}
        >
          {filteredTechStack.map((tech, index) => (
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

      <div className="flex justify-center mt-4">
        <p className="text-sm text-muted-foreground">Scroll or drag to see more technologies</p>
      </div>
    </div>
  )
}

