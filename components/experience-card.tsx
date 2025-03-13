import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle } from "lucide-react"

interface ExperienceCardProps {
  experience: {
    title: string
    company: string
    period: string
    description: string
    achievements: string[]
    technologies: string[]
  }
}

export function ExperienceCard({ experience }: ExperienceCardProps) {
  return (
    <Card className="overflow-hidden transition-all duration-300 hover:shadow-md group border-primary/10 bg-gradient-to-br from-background to-background/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold group-hover:text-primary transition-colors">{experience.title}</h3>
            <p className="text-primary font-medium">{experience.company}</p>
          </div>
          <div className="mt-2 md:mt-0">
            <span className="inline-block bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
              {experience.period}
            </span>
          </div>
        </div>

        <p className="text-muted-foreground mb-4">{experience.description}</p>

        <div className="mb-4">
          <h4 className="text-sm font-semibold mb-2">Key Achievements:</h4>
          <ul className="space-y-2">
            {experience.achievements.map((achievement, index) => (
              <li key={index} className="flex items-start group/item">
                <CheckCircle className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0 transition-transform duration-300 group-hover/item:scale-110" />
                <span className="group-hover/item:text-primary transition-colors">{achievement}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          {experience.technologies.map((tech) => (
            <Badge
              key={tech}
              variant="secondary"
              className="bg-primary/10 text-primary hover:bg-primary hover:text-primary-foreground transition-colors duration-300"
            >
              {tech}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

