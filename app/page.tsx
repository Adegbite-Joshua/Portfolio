import { PortfolioOS } from "@/components/portfolio-os"
import { experiences, portfolioProjects, profile, skillGroups } from "@/data/portfolio"

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    jobTitle: profile.title,
    email: profile.email,
    url: "https://portfolio.local",
    sameAs: [profile.links.github, profile.links.linkedin, profile.links.twitter],
    knowsAbout: skillGroups.flatMap((group) => group.skills),
    hasOccupation: experiences.map((experience) => ({
      "@type": "Occupation",
      name: experience.title,
      description: experience.description,
    })),
    workExample: portfolioProjects.map((project) => ({
      "@type": "CreativeWork",
      name: project.name,
      description: project.description,
      url: project.web_url,
      codeRepository: project.source_code_link,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PortfolioOS />
    </>
  )
}
