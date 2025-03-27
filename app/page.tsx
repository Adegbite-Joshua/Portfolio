import Image from "next/image"
import { TypewriterEffect } from "@/components/typewriter-effect"
import { ProjectCard } from "@/components/project-card"
import { ExperienceCard } from "@/components/experience-card"
import { ContactForm } from "@/components/contact-form"
import { CursorEffect } from "@/components/cursor-effect"
import { ScrollReveal } from "@/components/scroll-reveal"
import { BackgroundPattern } from "@/components/background-pattern"
import { VantaBackground } from "@/components/vanta-background"
import { SectionDivider } from "@/components/section-divider"
import { ThemeToggle } from "@/components/theme-toggle"
import { InspirationalQuote } from "@/components/inspirational-quote"
import { quotes } from "@/data/quotes"
import { Button } from "@/components/ui/button"
import { Github, Linkedin, Mail, Download, ArrowDown, Code, Briefcase, User, Send, TwitterIcon } from "lucide-react"
import { FallbackBackground } from "@/components/fallback-background"
import { projects } from "@/data/projects"
import { AutoScrollingTechStack } from "@/components/auto-scrolling-tech-stacks"

export default function Home() {
  const words = [
    { text: "Full-stack developer." },
    { text: "Code optimization specialist." },
    { text: "UI/UX craftsman." },
    { text: "Performance-driven engineer." },
    { text: "AI-powered solutions builder." },
    { text: "Web efficiency expert." },
    { text: "Clean code advocate." },
    { text: "Future-focused technologist." },
    { text: "Productivity booster with AI." },
    { text: "Seamless web experiences." },
    { text: "Optimization at core." },
    { text: "Smart automation believer." }
  ];

  const experiences = [
    {
      title: "Freelance Full Stack Developer",
      company: "Self-employed",
      period: "2024 - Present",
      description: "Developed full-stack web applications for various clients.",
      achievements: [
        "Built real-time communication platforms with WebRTC",
        "Created interactive learning management systems",
        "Developed hotel booking platforms with payment integration",
        "Implemented responsive designs across multiple projects"
      ],
      technologies: ["Nextjs", "React", "Angular", "Node.js", "Laravel", "MongoDB", "MySQL", "Paystack", "Stripe"]
    },
    {
      title: "Frontend Developer",
      company: "Crawdwall Company",
      period: "2025 - Present",
      description: "Develop responsive and interactive user interfaces for web applications using modern frontend frameworks.",
      achievements: [
        "Implemented component-based architecture improving code reusability",
        "Optimized web performance through efficient rendering techniques",
        "Collaborated with UX designers to build WCAG-compliant interfaces",
        "Reduced bundle sizes through code splitting and lazy loading"
      ],
      technologies: ["React", "Tailwind CSS", "TypeScript", "Framer Motion"]
    },
    {
      title: "Backend Developer",
      company: "LIACT",
      period: "June 2024 - August 2024",
      description: "Developed and maintained backend services for web applications.",
      achievements: [
        "Built RESTful APIs with Node.js and Express",
        "Implemented secure authentication with JWT",
        "Optimized database queries for improved performance",
        "Designed role-based access control system"
      ],
      technologies: ["Node.js", "Express", "MongoDB", "JWT", "REST API"]
    },
    {
      title: "Software Engineering Student",
      company: "Soft Quest Incorporated",
      period: "2024",
      description: "Completed intensive software engineering training program.",
      achievements: [
        "Mastered full-stack development fundamentals",
        "Developed multiple projects using modern web technologies",
        "Gained experience with agile development methodologies"
      ],
      technologies: ["JavaScript", "HTML/CSS", "Node.js", "React", "MongoDB"]
    }
  ];

  return (
    <main className="flex min-h-screen flex-col items-center bg-background text-foreground">
      <CursorEffect />
      <FallbackBackground />
      <VantaBackground />
      <ThemeToggle />

      {/* Hero Section */}
      <section className="relative w-full min-h-screen flex flex-col md:flex-row items-center justify-center py-12 px-4 md:px-6 overflow-hidden">
        <BackgroundPattern />

        <div className="flex flex-col items-center md:items-start space-y-6 md:w-1/2 text-center md:text-left mb-8 md:mb-0 z-10">
          <ScrollReveal>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
              Hi, I'm <span className="text-primary">Joshua Adegbite</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <div className="h-16">
              <TypewriterEffect words={words} />
            </div>
          </ScrollReveal>

          <ScrollReveal delay={400}>
            <p className="text-muted-foreground text-lg max-w-md">
              I build responsive, scalable web applications with modern technologies and a focus on performance and user
              experience.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={600}>
            <div className="flex gap-4 mt-6">
              <a href="mailto:adegbitejoshua07@gmail.com" className="relative overflow-hidden group">
                <Button className="relative overflow-hidden group">
                  <span className="relative z-10">Contact Me</span>
                  <span className="absolute inset-0 bg-gradient-to-r from-primary to-primary/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
                  <Mail className="ml-2 h-4 w-4 relative z-10" />
                </Button>
              </a>
              <a download href="/Joshua Adegbite Resume.pdf" className="group">
                <Button variant="outline" className="group">
                  Resume
                  <Download className="ml-2 h-4 w-4 transition-transform group-hover:translate-y-1" />
                </Button>
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={800}>
            <div className="flex gap-4 mt-4">
              <a
                href="https://github.com/Adegbite-Joshua"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
              >
                <Github className="h-6 w-6" />
              </a>
              <a
                href="https://www.linkedin.com/in/adegbite-joshua-8a45a6257"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
              >
                <Linkedin className="h-6 w-6" />
              </a>
              <a
                href="https://x.com/JoshuaAdegbite7"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
              >
                <TwitterIcon className="h-6 w-6" />
              </a>
              <a
                href="mailto:adegbitejoshua07@gmail.com"
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
              >
                <Mail className="h-6 w-6" />
              </a>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal direction="left" className="md:w-1/2 flex justify-center md:justify-end z-10">
          <div className="relative w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden border-4 border-primary/50 shadow-[0_0_25px_rgba(99,102,241,0.4)]">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent z-10"></div>
            <Image
              src="/image.jpeg"
              alt="Joshua Adegbite - Software Engineer"
              fill
              className="object-cover"
              priority
            />
          </div>
        </ScrollReveal>

        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <a href="#about" className="text-muted-foreground hover:text-primary transition-colors">
            <ArrowDown className="h-6 w-6" />
          </a>
        </div>
      </section>

      <ScrollReveal>
        <InspirationalQuote quote={quotes[0].quote} author={quotes[0].author} className="max-w-4xl mx-auto" />
      </ScrollReveal>

      {/* About Section */}
      <section id="about" className="relative w-full py-20 px-4 md:px-6">
        <BackgroundPattern />

        <div className="container mx-auto z-10 relative">
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-12">
              <User className="h-6 w-6 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold">About Me</h2>
              <div className="flex-grow h-px bg-gradient-to-r from-primary/50 to-transparent"></div>
            </div>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <ScrollReveal className="mt-0">
              <div className="space-y-6">
                <p className="text-lg">
                  I'm a passionate full-stack developer with over 5 years of experience building web applications. My
                  journey in software development started with a curiosity about how websites work, which led me to dive
                  deep into both frontend and backend technologies.
                </p>
                <p className="text-lg">
                  I specialize in creating robust web applications using modern JavaScript frameworks and backend
                  technologies. While I primarily focus on web development, I have a basic understanding of native app
                  development concepts.
                </p>
                <p className="text-lg">
                  As a freelancer, I've had the opportunity to work with diverse clients across various industries,
                  helping them bring their ideas to life through technology.
                </p>
              </div>
            </ScrollReveal>

            <div className="space-y-8">
              <ScrollReveal delay={200}>
                <div className="p-6 rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent backdrop-blur-sm">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2"></span>
                    Frontend
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {["React", "Next.js", "Angular", "TypeScript", "Javascript", "Blade", "Tailwind CSS", "Redux", "jQuery", "HTML/CSS"].map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={400}>
                <div className="p-6 rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent backdrop-blur-sm">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2"></span>
                    Backend
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {["Node.js", "Express", "Laravel", "Python", "Flask", "MongoDB", "MySQL", "REST APIs", "Firebase"].map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={600}>
                <div className="p-6 rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent backdrop-blur-sm">
                  <h3 className="text-xl font-semibold mb-4 flex items-center">
                    <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2"></span>
                    Tools & Others
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {[
                      "Git",
                      "PWA",
                      "AI & ML Integration",
                      "REST APIs",
                      "SQL/NoSQL",
                      "React Native",
                      "Redux",
                      "Sass",
                      "Figma",
                      "UX/UI",
                      "WebSockets",
                      "Socket.io",
                      "Stripe",
                      "Paystack",
                      "OAuth",
                      "JWT",
                    ].map((skill) => (<span
                      key={skill}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm transition-all duration-300 hover:bg-primary hover:text-primary-foreground"
                    >
                      {skill}
                    </span>
                    ))}
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={800}>
                <h3 className="text-xl font-semibold mb-6 flex items-center">
                  <span className="inline-block w-2 h-2 rounded-full bg-primary mr-2"></span>
                  Technologies I Work With
                </h3>
                <AutoScrollingTechStack />
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      <SectionDivider />

      <ScrollReveal>
        <InspirationalQuote quote={quotes[1].quote} author={quotes[1].author} className="max-w-4xl mx-auto" />
      </ScrollReveal>

      {/* Experience Section */}
      <section id="experience" className="relative w-full py-20 px-4 md:px-6">
        <BackgroundPattern />

        <div className="container mx-auto z-10 relative">
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-4">
              <Briefcase className="h-6 w-6 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold">Work Experience</h2>
              <div className="flex-grow h-px bg-gradient-to-r from-primary/50 to-transparent"></div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
              My professional journey includes both freelance work and employment positions.
            </p>
          </ScrollReveal>

          <div className="space-y-8">
            {experiences.map((experience, index) => (
              <ScrollReveal key={index} delay={300 + index * 150} direction={index % 2 === 0 ? "right" : "left"}>
                <ExperienceCard experience={experience} />
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      <ScrollReveal>
        <InspirationalQuote quote={quotes[2].quote} author={quotes[2].author} className="max-w-4xl mx-auto" />
      </ScrollReveal>

      {/* Projects Section */}
      <section id="projects" className="relative w-full py-20 px-4 md:px-6">
        <BackgroundPattern />

        <div className="container mx-auto z-10 relative">
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-4">
              <Code className="h-6 w-6 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold">My Projects</h2>
              <div className="flex-grow h-px bg-gradient-to-r from-primary/50 to-transparent"></div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
              Here are some of the projects I've worked on. Each project represents different challenges and solutions.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <ScrollReveal key={index} delay={300 + index * 100}>
                <ProjectCard project={project} />
              </ScrollReveal>
            ))}
          </div>

          {/* <ScrollReveal delay={700}>
            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="group">
                View More Projects
                <span className="ml-2 inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Button>
            </div>
          </ScrollReveal> */}
        </div>
      </section>

      <SectionDivider />

      <ScrollReveal>
        <InspirationalQuote quote={quotes[3].quote} author={quotes[3].author} className="max-w-4xl mx-auto" />
      </ScrollReveal>

      {/* Contact Section */}
      <section id="contact" className="relative w-full py-20 px-4 md:px-6">
        <BackgroundPattern />

        <div className="container mx-auto z-10 relative">
          <ScrollReveal>
            <div className="flex items-center gap-4 mb-4">
              <Send className="h-6 w-6 text-primary" />
              <h2 className="text-3xl md:text-4xl font-bold">Get In Touch</h2>
              <div className="flex-grow h-px bg-gradient-to-r from-primary/50 to-transparent"></div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={200}>
            <p className="text-muted-foreground text-center max-w-2xl mx-auto mb-12">
              Have a project in mind or want to discuss potential opportunities? Feel free to reach out!
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <ScrollReveal delay={300} direction="right">
              <div className="space-y-6 p-6 rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent backdrop-blur-sm">
                <h3 className="text-2xl font-semibold">Contact Information</h3>
                <div className="space-y-4">
                  <div className="flex items-center gap-3 group">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      <Mail className="h-5 w-5" />
                    </div>
                    <a
                      href="mailto:adegbitejoshua07@gmail.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      adegbitejoshua07@gmail.com
                    </a>
                  </div>
                  <div className="flex items-center gap-3 group">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      <TwitterIcon className="h-5 w-5" />
                    </div>
                    <a
                      href="https://x.com/JoshuaAdegbite7"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      @JoshuaAdegbite7
                    </a>
                  </div>
                  <div className="flex items-center gap-3 group">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      <Linkedin className="h-5 w-5" />
                    </div>
                    <a
                      href="https://www.linkedin.com/in/adegbite-joshua-8a45a6257"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      linkedin.com/in/adegbite-joshua-8a45a6257
                    </a>
                  </div>
                  <div className="flex items-center gap-3 group">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      <Github className="h-5 w-5" />
                    </div>
                    <a
                      href="https://github.com/Adegbite-Joshua"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-primary transition-colors"
                    >
                      github.com/Adegbite-Joshua
                    </a>
                  </div>
                </div>
                <div className="pt-6">
                  <h3 className="text-2xl font-semibold mb-4">Let's Connect</h3>
                  <p className="text-muted-foreground mb-4">
                    I'm always open to discussing new projects, creative ideas, or opportunities to be part of your
                    vision.
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={400} direction="left">
              <div className="p-6 rounded-lg border border-primary/20 bg-gradient-to-br from-primary/5 to-transparent backdrop-blur-sm">
                <ContactForm />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative w-full py-8 px-4 md:px-6 border-t border-primary/10">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-muted-foreground">© {new Date().getFullYear()} Joshua Adegbite. All rights reserved.</p>
          </div>
          <div className="flex gap-4">
            <a
              href="https://github.com/Adegbite-Joshua"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://x.com/JoshuaAdegbite7"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
            >
              <TwitterIcon className="h-5 w-5" />
            </a>
            <a
              href="https://www.linkedin.com/in/adegbite-joshua-8a45a6257"
              target="_blank"
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
            >
              <Linkedin className="h-5 w-5" />
            </a>
            <a
              href="mailto:adegbitejoshua07@gmail.com"
              className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-110"
            >
              <Mail className="h-5 w-5" />
            </a>
          </div>
        </div>
      </footer>
    </main>
  )
}

