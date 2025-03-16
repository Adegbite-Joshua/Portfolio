import Image from "next/image"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink, Github } from "lucide-react"
import type { ProjectProps } from "@/data/projects"

interface ProjectCardProps {
  project: ProjectProps
}

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-500 hover:shadow-lg hover:shadow-primary/20 hover:-translate-y-1 group">
      <div className="relative h-48 w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>
        <Image
          src={project.imageUrl || "/placeholder.svg"}
          alt={project.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
        />
      </div>
      <CardContent className="p-6 border-t border-primary/10 bg-gradient-to-b from-background to-background/80 backdrop-blur-sm">
        <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors">{project.name}</h3>
        <p className="text-muted-foreground mb-4">{project.description}</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {project.tags.map((tag) => (
            <span
              key={tag.name}
              className={`px-2 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium transition-all duration-300 hover:bg-primary hover:text-primary-foreground ${tag.color}`}
            >
              {tag.name}
            </span>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-between p-6 pt-0">
        <Button variant="outline" size="sm" asChild className="group/btn">
          <a href={project.source_code_link} target="_blank" rel="noopener noreferrer">
            <Github className="mr-2 h-4 w-4 transition-transform duration-300 group-hover/btn:rotate-12" />
            Code
          </a>
        </Button>
        <Button size="sm" asChild className="group/btn relative overflow-hidden">
          <a href={project.web_url} target="_blank" rel="noopener noreferrer">
            <span className="relative z-10">Demo</span>
            <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></span>
            <ExternalLink className="ml-2 h-4 w-4 relative z-10 transition-transform duration-300 group-hover/btn:translate-x-1 group-hover/btn:-translate-y-1" />
          </a>
        </Button>
      </CardFooter>
    </Card>
  )
}

